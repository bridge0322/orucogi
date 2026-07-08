import { useId } from "react";
import { roomParamsFor } from "../tracker/logic/roomStages";

// パーツ（耳/目/口/しっぽ/前足/後足/アクセサリ）ごとにグループ化した
// リグ構造のコーギー。props で表情・ポーズを合成する。
// 作画は初期版（RoomCorgi）の犬をベースに、目・口・耳・足を差し替え可能にしたもの。

export type Pose = "stand" | "sit" | "sleep" | "run" | "sniff" | "stretch";
export type EyeState = "open" | "closed" | "happy" | "sleepy";
export type MouthState = "smile" | "tongue" | "open" | "yawn" | "closed";
export type Accessory = "none" | "nightcap" | "bandana";
export interface OutfitItem { id: string; color: string; sub?: string }

export interface LifeCorgiProps {
  level: number;        // 成長段階 1-12（体格に反映）
  pose: Pose;
  legPhase: number;     // 0..1 歩行サイクル
  tailWag: number;      // しっぽの現在角度(deg)
  eyes: EyeState;
  mouth: MouthState;
  earTwitchL?: number;  // 左耳の回転(deg)
  earTwitchR?: number;
  earDown?: boolean;    // 耳ペタン
  headTilt?: number;    // 首かしげ(deg)
  lift?: number;        // ジャンプの高さ(px)。体だけ持ち上げ、影は地面に残す
  sleepStyle?: number;  // 寝相（0..4）。sleep ポーズのときの寝姿を変える
  pawLift?: { l?: number; r?: number }; // 前足を上げる回転角(deg)。お手／おかわり／ハイタッチ用
  accessory?: Accessory;
  outfit?: { collar?: OutfitItem; bandana?: OutfitItem; hat?: OutfitItem; shirt?: OutfitItem }; // 着せ替え装着中
  raincoat?: boolean;   // 雨の日のレインコート姿
  proud?: boolean;      // 胸を張るドヤ
  blush?: boolean;
  silhouette?: boolean; // 遠吠えシルエット演出用
}

// 色は初期版オルコギ（RoomCorgi）のコーギー作画に合わせる。
const OL = "#5A3A24", TAN = "#EDA94C", CREAM = "#FBF1E0", INNER_EAR = "#FBE3C9",
  DARK = "#4A2E1C", TONGUE = "#F4839A", BLUSH = "#F6B7BD";

// 寝相コレクション（SLEEP_STYLES と同じ並び）：まるまり／ぺたんこ／よこむき／まんまる／だらり。
const SLEEP_XF = [
  "translate(0 52) scale(1 0.78)",
  "translate(0 66) scale(1.16 0.58)",
  "translate(7 54) scale(1 0.8) rotate(-15 200 320)",
  "translate(0 58) scale(0.9 0.9)",
  "translate(-7 62) scale(1.1 0.66) rotate(9 200 320)",
];

export function LifeCorgi(p: LifeCorgiProps) {
  const uid = useId().replace(/[:]/g, "");
  const par = roomParamsFor(p.level);
  const running = p.pose === "run";
  const sitting = p.pose === "sit";
  const sleeping = p.pose === "sleep";
  const sniffing = p.pose === "sniff";
  const stretching = p.pose === "stretch";

  // 入場ダッシュは正面からの構図。脚を左右に振ると開脚して不自然なので、
  // 体を上下に弾ませ、4本の脚をそろえて「着地で伸び・空中で縮む」バウンド走りにする。
  const bound = running ? Math.sin(p.legPhase * Math.PI * 2) * 0.5 + 0.5 : 0; // 0=着地 1=空中
  const runBob = bound * 9;   // 体の弾み（空中で上がる）
  const legTuck = bound * 9;  // 脚の縮み（空中で足をしまう）
  const sitDrop = sitting ? 14 : 0;
  const lift = p.lift ?? 0;
  const pawL = p.pawLift?.l ?? 0; // 前足（画面左）を上げる量 0..1
  const pawR = p.pawLift?.r ?? 0; // 前足（画面右）を上げる量 0..1
  // 体は中心(y=250)を基準に拡縮するので、足の接地ラインも体格で上下する。
  // 立ち足の下端(元 y=346)を同じ変換にかけて、影をその足元に合わせる。
  const groundY = 250 + (346 - 250) * par.bodyScale * par.bodyStretch;

  // 毛色はつねに Phase 1 と同じ通常色（虹色は廃止）。
  const tan = TAN;
  const bodyFill = p.silhouette ? "#2E2A45" : tan;
  const creamFill = p.silhouette ? "#3A3555" : CREAM;
  const olStroke = p.silhouette ? "#242038" : OL;

  // 耳：コーギーの立ち耳。ペタンはさらに外へ倒し、ピクッは小さく回転。
  // 成長に合わせて earUp が上がるほど、耳がぴんと立つ（子犬はやや寝ている）。
  const earL = (p.earDown ? 16 : 0) + (p.earTwitchL || 0);
  const earR = -(p.earDown ? 16 : 0) + (p.earTwitchR || 0);
  const earTipY = 18 + (1 - par.earUp) * 78;
  const earOutX = (1 - par.earUp) * 26;

  // ポーズごとの全体変形
  let bodyXf = "";
  if (sleeping) bodyXf = SLEEP_XF[p.sleepStyle ?? 0] || SLEEP_XF[0];
  else if (stretching) bodyXf = "rotate(-8 200 340)";
  else if (p.proud) bodyXf = "rotate(-5 200 340)";
  let headXf = "";
  if (sniffing) headXf = "translate(-36 66) rotate(-30 200 150)";
  else if (sleeping) headXf = "translate(0 26) rotate(6 200 150)";
  else if (stretching || p.proud) headXf = "translate(0 -8) rotate(4 200 150)";
  if (p.headTilt) headXf += ` rotate(${p.headTilt} 200 150)`;

  // 目（RoomCorgi と同じ位置・大きさ。表情ぶんは残す）
  const eyeK = sleeping ? "closed" : p.eyes;
  const Eye = ({ cx }: { cx: number }) => {
    if (eyeK === "closed")
      return <path d={`M${cx - 13} 148 Q${cx} 159 ${cx + 13} 148`} fill="none" stroke={DARK} strokeWidth="6" strokeLinecap="round" />;
    if (eyeK === "happy")
      return <path d={`M${cx - 13} 155 Q${cx} 137 ${cx + 13} 155`} fill="none" stroke={DARK} strokeWidth="6" strokeLinecap="round" />;
    if (eyeK === "sleepy")
      return (
        <g>
          <ellipse cx={cx} cy="151" rx={14 * par.eyeSize} ry={14 * par.eyeSize} fill={DARK} />
          <circle cx={cx + 4} cy={145} r={4.6 * par.eyeSize} fill="#fff" />
          <path d={`M${cx - 16} 142 Q${cx} 137 ${cx + 16} 142`} fill="none" stroke={OL} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    return (
      <g>
        <ellipse cx={cx} cy="150" rx={15 * par.eyeSize} ry={17 * par.eyeSize} fill={DARK} />
        <circle cx={cx + 3} cy={144} r={5 * par.eyeSize} fill="#fff" />
      </g>
    );
  };

  // 口（RoomCorgi 風のフラットな顔。鼻は白ブレーズの上にじかに。表情ぶんは残す）
  const nose = <ellipse cx="200" cy="176" rx="13" ry="9" fill={DARK} />;
  const mouthK = sleeping ? "closed" : p.mouth;
  const Mouth = (
    <g id={`mouth-${uid}`}>
      {nose}
      <path className="lc-tn" d="M200 186 L200 196" />
      {mouthK === "closed" && <path className="lc-tn" d="M200 196 q-16 12 -30 1 M200 196 q16 12 30 1" />}
      {mouthK === "smile" && (
        <g><path className="lc-tn" d="M200 196 q-20 16 -34 2" /><path className="lc-tn" d="M200 196 q20 16 34 2" /></g>
      )}
      {mouthK === "tongue" && (
        <g>
          <path className="lc-tn" d="M200 196 q-20 16 -34 2" /><path className="lc-tn" d="M200 196 q20 16 34 2" />
          <path className="lc-ol" fill={TONGUE} strokeWidth="6" d="M184 202 q16 24 32 0 q-2 16 -16 16 q-14 0 -16 -16 z" />
        </g>
      )}
      {mouthK === "open" && (
        <g>
          <path className="lc-ol" fill="#8C4A3E" strokeWidth="6" d="M182 196 q18 24 36 0 q-4 20 -18 20 q-14 0 -18 -20 z" />
          <path fill={TONGUE} d="M192 206 q8 11 16 0 q-2 9 -8 9 q-6 0 -8 -9 z" />
        </g>
      )}
      {mouthK === "yawn" && (
        <g>
          <ellipse cx="200" cy="205" rx="15" ry="13" fill="#8C4A3E" stroke={olStroke} strokeWidth="6" />
          <ellipse cx="200" cy="213" rx="8" ry="4" fill={TONGUE} />
        </g>
      )}
    </g>
  );

  return (
    <svg viewBox="0 0 400 388" width="100%" height="100%" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <style>{`.lc-ol{stroke:${olStroke};stroke-width:9;stroke-linejoin:round;stroke-linecap:round;}.lc-tn{stroke:${olStroke};stroke-width:6;fill:none;stroke-linecap:round;}`}</style>
      </defs>
      {/* 影は地面に固定（足元に密着）。ジャンプで体が上がるほど小さく薄くする */}
      <ellipse cx="200" cy={groundY + 8} rx={(56 - Math.min(40, lift) * 0.4) * par.bodyScale} ry={9 * par.bodyScale} fill="#000" opacity={Math.max(0.05, 0.14 - lift * 0.002)} />
      <g transform={`translate(0 ${-lift - runBob}) ${bodyXf} translate(200 250) scale(0.86 1) translate(-200 -250)`}>
        {/* ---- 胴体 ---- */}
        <g id={`body-${uid}`} transform={`translate(0 ${sitDrop}) translate(200 250) scale(${par.bodyScale} ${par.bodyScale * par.bodyStretch}) translate(-200 -250)`}>
          {/* しっぽ */}
          <g id={`tail-${uid}`} transform={`rotate(${p.tailWag} 122 256)`}>
            <path fill={bodyFill} className="lc-ol" d="M124 250 q-30 -6 -34 -34 q-2 -16 12 -16 q10 14 6 30 q14 6 16 20 z" />
          </g>
          <path className="lc-ol" fill={bodyFill} d="M200 150 C150 150 120 185 120 245 C120 312 150 348 200 348 C250 348 280 312 280 245 C280 185 250 150 200 150 Z" />
          <path fill={creamFill} d="M200 198 C176 198 162 222 162 264 C162 314 180 340 200 340 C220 340 238 314 238 264 C238 222 224 198 200 198 Z" />
          {/* 後足（バウンド走りで上下に縮む。左右には振らない） */}
          <g id={`legBack-${uid}`} transform={`translate(0 ${-sitDrop - legTuck})`} opacity={sitting || sleeping ? 0 : 1}>
            <path className="lc-ol" fill={creamFill} d="M140 324 q-2 22 14 22 q16 0 14 -22 z" />
            <path className="lc-ol" fill={creamFill} d="M232 324 q-2 22 14 22 q16 0 14 -22 z" />
          </g>
          {/* 前足。お手・おかわり・ハイタッチでは、短い足のまま胸のあたりへ持ち上げる
              （ダックスは足が短いので、棒のように伸ばさず元の肉球をそのまま上げるだけ）。 */}
          <g id={`legFront-${uid}`} transform={`translate(0 ${-sitDrop - legTuck})`} opacity={sleeping ? 0 : 1}>
            <g transform={pawL > 0 ? `translate(${-pawL * 10} ${-pawL * 64}) rotate(${-pawL * 8} 182 324)` : undefined}>
              <path className="lc-ol" fill={creamFill} d="M168 324 q-2 22 14 22 q16 0 14 -22 z" />
            </g>
            <g transform={pawR > 0 ? `translate(${pawR * 10} ${-pawR * 64}) rotate(${pawR * 8} 218 324)` : undefined}>
              <path className="lc-ol" fill={creamFill} d="M204 324 q-2 22 14 22 q16 0 14 -22 z" />
            </g>
          </g>
          {/* ボーダーシャツ（胴に着る・ボーダー柄）。着ているときは胸の毛もようを隠す。 */}
          {!p.silhouette && p.outfit?.shirt && (() => {
            const base = p.outfit.shirt.sub || "#FBEAD0";
            const stripe = p.outfit.shirt.color;
            const d = "M128 232 Q200 253 272 232 Q281 283 246 310 Q200 324 154 310 Q119 283 128 232 Z";
            return (
              <g id={`shirt-${uid}`}>
                <clipPath id={`shirtclip-${uid}`}><path d={d} /></clipPath>
                <path d={d} fill={base} stroke={olStroke} strokeWidth="6" strokeLinejoin="round" />
                <g clipPath={`url(#shirtclip-${uid})`}>
                  {[242, 260, 278, 296].map((y, i) => (
                    <rect key={i} x="112" y={y} width="176" height="11" fill={stripe} />
                  ))}
                </g>
                <path d="M128 232 Q200 253 272 232" fill="none" stroke={olStroke} strokeWidth="6" strokeLinecap="round" />
              </g>
            );
          })()}
          {!p.outfit?.shirt && <path className="lc-tn" d="M186 288 q8 10 14 0 q6 10 14 0" />}
          {/* バンダナ（装着 or 週末デフォルト）。装着アイテムが優先。 */}
          {!p.silhouette && (p.outfit?.bandana || p.accessory === "bandana") && (() => {
            const b = p.outfit?.bandana;
            const col = b?.color || "#4E97C2";
            const sub = b?.sub || "#fff";
            return (
              <g id={`bandana-${uid}`}>
                <path d="M128 176 q72 34 144 0 q-8 30 -72 30 q-64 0 -72 -30 z" fill={col} stroke={olStroke} strokeWidth="6" strokeLinejoin="round" />
                <path d="M236 200 L258 252 L236 246 L228 204 Z" fill={col} stroke={olStroke} strokeWidth="5" strokeLinejoin="round" />
                {b?.id === "bandana-dot" && [160, 185, 210, 235].map((x, i) => <circle key={i} cx={x} cy={i % 2 ? 196 : 188} r="4" fill={sub} />)}
                {b?.id === "bandana-stripe" && <g stroke={sub} strokeWidth="4"><path d="M150 186 L250 186" /><path d="M146 198 L254 198" /></g>}
                {b?.id === "bandana-star" && <path d="M200 182 l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1 z" fill={sub} />}
                {b?.id === "bandana-check" && <g stroke={sub} strokeWidth="3" opacity="0.9"><path d="M175 180 L175 200" /><path d="M200 182 L200 202" /><path d="M225 180 L225 200" /><path d="M160 190 L240 190" /></g>}
                {b?.id === "bandana-flower" && <g fill={sub}><circle cx="200" cy="192" r="5" /><circle cx="192" cy="190" r="3" /><circle cx="208" cy="190" r="3" /><circle cx="196" cy="198" r="3" /><circle cx="204" cy="198" r="3" /></g>}
              </g>
            );
          })()}
        </g>
        {/* ---- 頭 ---- */}
        <g id={`head-${uid}`} transform={`${headXf} translate(200 150) scale(${0.78 + par.bodyScale * 0.22}) translate(-200 -150)`}>
          {/* 耳（コーギーの立ち耳・左右で回転できる）。頭の後ろに描いて、根もとは頭で隠す。 */}
          <g id={`earL-${uid}`} transform={`rotate(${earL} 150 82)`}>
            <path className="lc-ol" fill={bodyFill} d={`M126 96 L${92 - earOutX} ${earTipY} L196 86 Z`} />
            {!p.silhouette && <path fill={INNER_EAR} d={`M138 92 L${118 - earOutX * 0.6} ${earTipY + 24} L182 86 Z`} />}
          </g>
          <g id={`earR-${uid}`} transform={`rotate(${earR} 250 82)`}>
            <path className="lc-ol" fill={bodyFill} d={`M274 96 L${308 + earOutX} ${earTipY} L204 86 Z`} />
            {!p.silhouette && <path fill={INNER_EAR} d={`M262 92 L${282 + earOutX * 0.6} ${earTipY + 24} L218 86 Z`} />}
          </g>
          <path className="lc-ol" fill={bodyFill} d="M200 60 C140 60 104 108 104 162 C104 214 146 244 200 244 C254 244 296 214 296 162 C296 108 260 60 200 60 Z" />
          {/* 白い顔（額のブレーズ〜マズル。RoomCorgi と同じかたち） */}
          <path fill={creamFill} d="M200 78 C188 78 182 108 182 140 C158 150 150 178 162 200 C176 224 224 224 238 200 C250 178 242 150 218 140 C218 108 212 78 200 78 Z" />
          {/* ほっぺ（コーギーはつねにほんのりピンク。うれしい時はもう少し濃く） */}
          {!p.silhouette && (
            <g id={`blush-${uid}`}>
              <ellipse cx="138" cy="178" rx={26 * par.cheek} ry={20 * par.cheek} fill={BLUSH} opacity={p.blush || eyeK === "happy" ? 0.85 : 0.6} />
              <ellipse cx="262" cy="178" rx={26 * par.cheek} ry={20 * par.cheek} fill={BLUSH} opacity={p.blush || eyeK === "happy" ? 0.85 : 0.6} />
            </g>
          )}
          {!p.silhouette && (
            <g id={`eyes-${uid}`}><Eye cx={160} /><Eye cx={240} /></g>
          )}
          {!p.silhouette && Mouth}
          {/* レインコートのフード（雨の日・帽子/ナイトキャップより手前） */}
          {!p.silhouette && p.raincoat && !p.outfit?.hat && (
            <g id={`rain-${uid}`}>
              <path d="M110 120 Q200 40 290 120 Q300 150 286 160 Q200 96 114 160 Q100 150 110 120 Z" fill="#F2C14E" stroke={olStroke} strokeWidth="6" strokeLinejoin="round" />
              <ellipse cx="200" cy="150" rx="42" ry="30" fill={creamFill} stroke={olStroke} strokeWidth="5" opacity="0.0" />
            </g>
          )}
          {/* 帽子（装着アイテムが優先。無ければ深夜のナイトキャップ） */}
          {!p.silhouette && p.outfit?.hat ? (
            <g id={`hat-${uid}`}>{renderHat(p.outfit.hat, olStroke)}</g>
          ) : p.accessory === "nightcap" && (
            <g id={`nightcap-${uid}`} transform="translate(200 62) rotate(-8)">
              <path d="M-64 10 Q-10 -66 70 -34 Q84 -28 74 -18 L64 -8 Q-6 -38 -50 18 Z" fill="#7B84C4" stroke={olStroke} strokeWidth="6" strokeLinejoin="round" />
              <path d="M-70 24 Q0 -8 72 -4 Q76 8 68 14 Q0 20 -60 36 Z" fill="#9AA3DE" stroke={olStroke} strokeWidth="6" strokeLinejoin="round" />
              <circle cx="80" cy="-26" r="14" fill="#FFF3C4" stroke={olStroke} strokeWidth="5" />
            </g>
          )}
        </g>
        {/* 首輪（頭より手前・あごのすぐ下の首もとに、細く巻く。鈴なし） */}
        {!p.silhouette && p.outfit?.collar && (
          <g id={`collar-${uid}`} transform={`translate(0 ${sitDrop}) translate(200 250) scale(${par.bodyScale} ${par.bodyScale * par.bodyStretch}) translate(-200 -250)`}>
            <path d="M156 233 Q200 244 244 233 Q244 238 200 248 Q156 238 156 233 Z" fill={p.outfit.collar.color} stroke={olStroke} strokeWidth="4" strokeLinejoin="round" />
          </g>
        )}
      </g>
    </svg>
  );
}

// 帽子アイテムの描画（頭グループ座標。頭頂は y≈60 あたり）
function renderHat(h: OutfitItem, ol: string) {
  const c = h.color, s = h.sub || "#7A5230";
  switch (h.id) {
    case "hat-straw":
      return (
        <g transform="translate(200 58)">
          <ellipse cx="0" cy="6" rx="80" ry="16" fill={c} stroke={ol} strokeWidth="6" />
          <path d="M-42 8 Q-38 -34 0 -34 Q38 -34 42 8 Z" fill={c} stroke={ol} strokeWidth="6" strokeLinejoin="round" />
          <path d="M-42 2 Q0 12 42 2" fill="none" stroke={s} strokeWidth="6" />
        </g>
      );
    case "hat-beret":
      return (
        <g transform="translate(200 52) rotate(-12)">
          <ellipse cx="0" cy="0" rx="52" ry="22" fill={c} stroke={ol} strokeWidth="6" />
          <circle cx="10" cy="-16" r="6" fill={s} stroke={ol} strokeWidth="4" />
        </g>
      );
    case "hat-party":
      return (
        <g transform="translate(200 60)">
          <path d="M0 -62 L34 6 L-34 6 Z" fill={c} stroke={ol} strokeWidth="6" strokeLinejoin="round" />
          <path d="M-28 -6 Q0 4 28 -6" fill="none" stroke={s} strokeWidth="5" />
          <circle cx="0" cy="-62" r="9" fill={s} stroke={ol} strokeWidth="4" />
        </g>
      );
    case "hat-crown":
      return (
        <g transform="translate(200 46)">
          <path d="M-40 14 L-40 -14 L-20 4 L0 -22 L20 4 L40 -14 L40 14 Z" fill={c} stroke={s} strokeWidth="5" strokeLinejoin="round" />
          <circle cx="0" cy="-2" r="5" fill="#E2574C" />
        </g>
      );
    case "hat-ribbon":
      return (
        <g transform="translate(200 62)">
          <path d="M0 0 L-32 -15 L-32 15 Z" fill={c} stroke={ol} strokeWidth="5" strokeLinejoin="round" />
          <path d="M0 0 L32 -15 L32 15 Z" fill={c} stroke={ol} strokeWidth="5" strokeLinejoin="round" />
          <circle cx="0" cy="0" r="8" fill={s} stroke={ol} strokeWidth="5" />
        </g>
      );
    default:
      return null;
  }
}
