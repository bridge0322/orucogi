import { roomParamsFor } from "../features/tracker/logic/roomStages";
import type { RoomStage } from "../features/tracker/logic/roomStages";

export interface RoomCorgiProps {
  level: number;
  badge: RoomStage["badge"];
  walkPhase: number;
  state: "walk" | "sit" | "idle";
  jump?: number;
  blink?: boolean;
}

export function RoomCorgi({ level, badge, walkPhase, state, jump = 0, blink = false }: RoomCorgiProps) {
  const p = roomParamsFor(level);
  const twoPi = Math.PI * 2;
  const ph = walkPhase * twoPi;
  const walking = state === "walk";
  const earTipY = 18 + (1 - p.earUp) * 78, earOutX = (1 - p.earUp) * 26;
  // 歩くときは弾むように、止まっているときは呼吸でゆっくり上下。
  const breath = Math.sin(ph) * 1.6;
  const lift = (walking ? Math.abs(Math.sin(ph)) * 6 : 0) + jump;
  const idleBob = walking ? 0 : breath;
  const legA = walking ? Math.max(0, Math.sin(ph)) * 9 : 0;
  const legB = walking ? Math.max(0, Math.sin(ph + Math.PI)) * 9 : 0;
  const tailWag = Math.sin(ph * 2) * (walking ? 7 : 15); // しっぽを元気に
  const sitDrop = state === "sit" ? 14 : 0;
  // お尻フリフリのワドル歩き＋頭ぴょこぴょこ＋首かしげ。
  const waddle = walking ? Math.sin(ph) * 3 : 0;
  const headBob = walking ? Math.sin(ph + Math.PI) * 2.6 : breath * 0.6;
  const headTilt = walking ? Math.sin(ph) * -2 : Math.sin(walkPhase * twoPi * 0.5) * 5;
  // 耳のふわっと揺れ。
  const earFlap = walking ? Math.abs(Math.sin(ph)) * 6 : Math.sin(ph) * 2;
  // ジャンプ中はぷにっと縦のび、着地でぺちゃっと。
  const js = Math.min(jump, 22) / 22;
  const sqX = 1 - js * 0.06, sqY = 1 + js * 0.10;
  return (
    <svg viewBox="0 0 400 388" width="100%" height="100%" style={{ display: "block", overflow: "visible" }}>
      <defs><style>{`.cr-ol{stroke:#5A3A24;stroke-width:9;stroke-linejoin:round;stroke-linecap:round;}.cr-tn{stroke:#5A3A24;stroke-width:6;fill:none;stroke-linecap:round;}`}</style></defs>
      <ellipse cx="200" cy={376} rx={(70 - js * 6) * p.bodyScale} ry={11 * p.bodyScale} fill="#000" opacity={0.12 - js * 0.04}/>
      <g transform={`rotate(${waddle} 200 360) translate(0 ${-lift + sitDrop + idleBob}) translate(200 360) scale(${sqX} ${sqY}) translate(-200 -360)`}>
        <g transform={`translate(200 250) scale(${p.bodyScale} ${p.bodyScale * p.bodyStretch}) translate(-200 -250)`}>
          <g transform={`rotate(${tailWag} 122 256)`}><path fill="#EDA94C" className="cr-ol" d="M124 250 q-30 -6 -34 -34 q-2 -16 12 -16 q10 14 6 30 q14 6 16 20 z"/></g>
          <path className="cr-ol" fill="#EDA94C" d="M200 150 C150 150 120 185 120 245 C120 312 150 348 200 348 C250 348 280 312 280 245 C280 185 250 150 200 150 Z"/>
          <path fill="#FBF1E0" d="M200 198 C176 198 162 222 162 264 C162 314 180 340 200 340 C220 340 238 314 238 264 C238 222 224 198 200 198 Z"/>
          <g transform={`translate(0 ${lift - sitDrop})`}>
            <path className="cr-ol" fill="#FBF1E0" d={`M168 ${324 - legA} q-2 22 14 22 q16 0 14 -22 z`}/>
            <path className="cr-ol" fill="#FBF1E0" d={`M204 ${324 - legB} q-2 22 14 22 q16 0 14 -22 z`}/>
          </g>
          <path className="cr-tn" d="M186 288 q8 10 14 0 q6 10 14 0"/>
        </g>
        <g transform={`translate(0 ${headBob}) rotate(${headTilt} 200 232)`}>
        <g transform={`translate(200 150) scale(${0.78 + p.bodyScale * 0.22}) translate(-200 -150)`}>
          <path className="cr-ol" fill="#EDA94C" d={`M126 96 L${92 - earOutX} ${earTipY + earFlap} L196 86 Z`}/>
          <path className="cr-ol" fill="#EDA94C" d={`M274 96 L${308 + earOutX} ${earTipY + earFlap} L204 86 Z`}/>
          <path fill="#FBE3C9" d={`M138 92 L${118 - earOutX * 0.6} ${earTipY + 24 + earFlap} L182 86 Z`}/>
          <path fill="#FBE3C9" d={`M262 92 L${282 + earOutX * 0.6} ${earTipY + 24 + earFlap} L218 86 Z`}/>
          <path className="cr-ol" fill="#EDA94C" d="M200 60 C140 60 104 108 104 162 C104 214 146 244 200 244 C254 244 296 214 296 162 C296 108 260 60 200 60 Z"/>
          <path fill="#FBF1E0" d="M200 78 C188 78 182 108 182 140 C158 150 150 178 162 200 C176 224 224 224 238 200 C250 178 242 150 218 140 C218 108 212 78 200 78 Z"/>
          <ellipse cx="138" cy="178" rx={26 * p.cheek} ry={20 * p.cheek} fill="#F6B7BD"/>
          <ellipse cx="262" cy="178" rx={26 * p.cheek} ry={20 * p.cheek} fill="#F6B7BD"/>
          {blink ? (
            <g className="cr-tn">
              <path d="M150 152 q10 -10 22 0"/>
              <path d="M230 152 q10 -10 22 0"/>
            </g>
          ) : (
            <>
              <ellipse cx="160" cy="150" rx={15 * p.eyeSize} ry={17 * p.eyeSize} fill="#4A2E1C"/>
              <ellipse cx="240" cy="150" rx={15 * p.eyeSize} ry={17 * p.eyeSize} fill="#4A2E1C"/>
              <circle cx={163} cy={144} r={5 * p.eyeSize} fill="#fff"/>
              <circle cx={243} cy={144} r={5 * p.eyeSize} fill="#fff"/>
            </>
          )}
          <ellipse cx="200" cy="176" rx="13" ry="9" fill="#4A2E1C"/>
          <path className="cr-tn" d="M200 186 L200 196"/>
          <path className="cr-tn" d="M200 196 q-20 16 -34 2"/>
          <path className="cr-tn" d="M200 196 q20 16 34 2"/>
          <path className="cr-ol" fill="#F4839A" strokeWidth="6" d="M184 202 q16 26 32 0 q-2 18 -16 18 q-14 0 -16 -18 z"/>
          {badge==="leaf"&&<g transform="translate(250 70) rotate(20)"><path d="M0 0 q18 -10 30 6 q-18 10 -30 -6 z" fill="#7FB069" stroke="#4E7A3F" strokeWidth="3"/></g>}
          {badge==="scarf"&&<path d="M120 232 q80 30 160 0 q-10 26 -80 26 q-70 0 -80 -26 z" fill="#E2574C" stroke="#A8392F" strokeWidth="5"/>}
          {badge==="medal"&&<g transform="translate(200 244)"><path d="M-14 0 L0 26 L14 0 Z" fill="#E2574C" stroke="#A8392F" strokeWidth="3"/><circle cx="0" cy="34" r="16" fill="#F2C14E" stroke="#B8860B" strokeWidth="4"/><text x="0" y="40" fontSize="16" textAnchor="middle" fill="#7A5200">★</text></g>}
          {badge==="crown"&&<g transform="translate(200 40)"><path d="M-40 14 L-40 -14 L-20 4 L0 -22 L20 4 L40 -14 L40 14 Z" fill="#F2C14E" stroke="#B8860B" strokeWidth="5" strokeLinejoin="round"/><circle cx="0" cy="-2" r="5" fill="#E2574C"/></g>}
          {badge==="halo"&&<ellipse cx="200" cy="34" rx="70" ry="16" fill="none" stroke="#F2C14E" strokeWidth="7" opacity="0.9"/>}
        </g>
        </g>
      </g>
    </svg>
  );
}
