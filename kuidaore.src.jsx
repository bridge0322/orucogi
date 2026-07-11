// 食い倒れ選手権 — アプリ本体のJSXソース（kuidaore.html の元）
// 編集後の再ビルド手順は README を参照。
const { useState, useEffect, useRef, useMemo } = React;

/* ===================== ドン太郎 100リアクション ===================== */
const R = {
  // A: 〜500kcal（小食煽り）
  a: [
    "そんなんで食い倒れ名乗ったら大阪中の人形に笑われるで",
    "それ、おやつやおやつ。スタートラインにも立ってへんわ",
    "太鼓叩く気にもならんわ…",
    "小鳥さんかな？",
    "ウォーミングアップにしても軽すぎるやろ",
    "わしの張りぼての腹のほうがまだ入っとるで",
    "遠慮は大阪では罪やで",
    "まだ胃袋が寝てるんちゃう？起こしたって",
    "カロリーメイトのほうが本気出しとるわ",
    "帰り道にたこ焼き買うて出直しといで",
  ],
  // B: 501〜1500（序盤）
  b: [
    "ぼちぼちやな。まだ序の口や",
    "お、エンジンかかってきたやん",
    "悪ないで。せやけど食い倒れへの道は長いで",
    "その調子や！太鼓ちょっとだけ叩いたるわ、ドン",
    "普通の人の一日分？そんなん基準にしてたらアカン",
    "腹八分目？そんな言葉、道頓堀に捨ててき",
    "ええ食べっぷりや。せやけどまだ人間の域やな",
    "折り返しはまだ先やで、ペース配分考えや",
    "うんうん、胃袋が目ぇ覚ましてきたな",
    "その一皿、わしの記録帳に書いといたるわ",
    "昼からその調子なら夜が楽しみやな",
    "まだ余裕の顔しとるな？ええ根性や",
    "悪くない、悪くないで。せやけど伝説には遠い",
    "胃袋のストレッチ完了ってとこやな",
    "次の一皿が本番やで",
  ],
  // C: 1501〜3000（中盤戦）
  c: [
    "おっ、本気出してきたな？",
    "半分越えたで！太鼓の音も大きなるわ、ドンドン！",
    "その腹、だんだん食い倒れの顔になってきたで",
    "常人ならここでリタイアや。あんたはどうする？",
    "道頓堀の川の流れのように、まだまだ行けるで",
    "カロリーが怖い？怖いのは後悔だけや",
    "ここからが根性の見せどころやで",
    "胃袋に「まだいける」って聞いてみ。返事するはずや",
    "3000の壁が見えてきたな。壁は越えるためにあるんや",
    "あんたの箸、光ってきたで",
    "わし、ちょっと感動してきたわ",
    "世間はこれを食べ過ぎと呼ぶ。わしは青春と呼ぶ",
    "デザートは別腹。これ大阪の科学やで",
    "その皿の数、勲章やと思い",
    "折り返し地点や！後半戦、行くで〜！",
  ],
  // D: 3001〜4999（認定目前）
  d: [
    "あとちょっとや！認定が見えてきたで！",
    "4000超え！？あんた何者や！",
    "太鼓叩きすぎて手ぇ痛いわ！",
    "ここでやめたら今までのカロリーが泣くで",
    "胃袋のリミッター、外れとるやろ",
    "認定まであと一皿…いや、あと一杯や！",
    "惜しい！ラーメン一杯分足りん！",
    "神様が「もうええで」って言うても、わしは「まだや」って言うで",
    "その腹、もう芸術品やな",
    "4999？一口や！あと一口！",
    "食い倒れの神様があんたを見とるで",
    "ゴールテープはすぐそこや、箸を止めなや",
    "明日の後悔は明日のあんたに任せとき",
    "ベルトの穴？そんなもん飾りや",
    "泣いても笑ってもあと数百キロカロリーや！",
  ],
  // E: 5000以上（食い倒れ認定）
  e: [
    "認定ーーー！！あんたが今日の食い倒れ王や！！",
    "ドンドンドンドン！！太鼓が壊れるまで叩いたるわ！！",
    "5000の壁を越えた者だけが見る景色、どうや？",
    "道頓堀に飛び込むより勇気ある行動やで",
    "わし、人形やのに涙出てきたわ",
    "あんたの胃袋、大阪城より大きいんちゃう？",
    "今日からあんたを「師匠」と呼ばせてもらうわ",
    "食い倒れの殿堂入りや！額に入れて飾りたいわ",
    "やるかやられるか？あんたは…やったんや！！",
    "5000kcal…それは努力と根性とちょっとの無謀の証や",
    "明日の体重計は見んでええ。今日は勝者や",
    "グリコの看板もあんたにはバンザイするわ",
    "胃袋に金メダルかけたるわ",
    "伝説はこうして生まれるんやなあ",
    "あんたの箸さばき、無形文化財に申請しとくわ",
    "今夜は胃薬と共に祝杯や！",
    "大阪府知事に報告せなアカンレベルや",
    "食い倒れ認定書、発行や！受け取りや！",
    "この記録、孫の代まで語り継ぎや",
    "完食、完勝、完璧や！！",
  ],
  // F: 鰻検出（×1.5）
  unagi: [
    "鰻きたーー！！特別ボーナスや！土用ちゃうくても関係あらへん！",
    "鰻は別格や。カロリーに品格ってもんがある",
    "うな重…あんた、勝負師やな",
    "蒲焼の匂いだけでわしの木の体が震えるわ",
    "鰻を食う者に悪人はおらん。ボーナス進呈や！",
    "ひつまぶし？三度おいしい、三倍加点や！（ウソやで、1.5倍や）",
    "鰻登りって言葉、今日のあんたのことやな",
    "タレの染みた米まで残さず食うんが礼儀やで",
    "白焼き？通やなあ…わさび添えて加点や",
    "鰻の脂は正義の脂。罪悪感は置いてき",
  ],
  // G: カレー検出（×1.3）
  curry: [
    "カレーは飲み物！特別加算や！！",
    "スパイスの香りで太鼓のリズムも変わるで、ドンドコドン！",
    "ルーの海に浮かぶ米の島…芸術や。加点！",
    "カツカレー？カツ＋カレー＝無敵の方程式や",
    "カレーは一晩寝かせると加点も増す…ことはないけど旨いわな",
    "大盛り？当然や。カレーに普通盛りは失礼やで",
    "福神漬けまで計算に入れたるわ、細かいやろ",
    "インド・大阪友好の架け橋、それがあんたのカレーや",
    "ナンおかわり自由？それ、無限加点システムやん",
    "汗かきながら食うカレーは倍旨い。加点も倍…はせんけどな",
  ],
  // H: 特殊条件
  sp: {
    night: "こんな時間に…あんた、本物の戦士やな",         // 23-4時
    streak: "二日連続！？胃袋にも休日あげてや！",           // 2日連続認定
    nofood: "何も写ってへんで？皿だけ撮ってどうすんねん",   // 検出できない
    salad: "ヘルシー…やと…？ここをどこや思てんねん",       // サラダ・野菜のみ
    morning: "朝からフルスロットル！今日はええ日になるで",  // 6-9時に1000kcal超
  },
};

const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];

/* ===================== ストレージ ===================== */
const KEY = "kuidaore_v1";
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const loadStore = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch(e){ return {}; }
};
const saveStore = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e){} };

const blankDay = (date) => ({ date, meals:[], total_kcal:0, total_points:0, certified:false });

/* ===================== API ===================== */
const MODEL = "claude-sonnet-4-6";
const SYSTEM = "あなたは料理写真からカロリーと量を推定する採点AIです。返答はJSONのみ。前置き・説明・マークダウン記法（```など）は一切禁止。カロリーは一般的な栄養データベース基準で、写っている量から推定してください。鰻料理（うな重・ひつまぶし・白焼き・う巻き等）はis_unagiをtrueに、カレー料理（カレーライス・カツカレー・ナン付きカレー・スープカレー等）はis_curryをtrueにしてください。次の形式で返してください: {\"foods\":[{\"name\":\"料理名\",\"estimated_amount\":\"推定量(例: 大盛り約400g)\",\"kcal\":850}],\"total_kcal\":850,\"is_unagi\":false,\"is_curry\":false,\"confidence\":\"high|medium|low\"}";

async function analyze(apiKey, base64, mediaType){
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{
      "content-type":"application/json",
      "x-api-key":apiKey,
      "anthropic-version":"2023-06-01",
      "anthropic-dangerous-direct-browser-access":"true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      messages:[{
        role:"user",
        content:[
          { type:"image", source:{ type:"base64", media_type:mediaType, data:base64 } },
          { type:"text", text:"この料理の量とカロリーを推定して、指定JSONのみ返して。" },
        ],
      }],
    }),
  });
  if(!res.ok){
    const t = await res.text().catch(()=> "");
    throw new Error(`API ${res.status}: ${t.slice(0,200)}`);
  }
  const data = await res.json();
  const textBlock = (data.content||[]).find(b=>b.type==="text");
  let raw = textBlock ? textBlock.text.trim() : "";
  // 念のためJSON部分だけ抽出
  raw = raw.replace(/^```json\s*/i,"").replace(/^```\s*/,"").replace(/```$/,"").trim();
  const m = raw.match(/\{[\s\S]*\}/);
  if(!m) throw new Error("JSON解析失敗");
  return JSON.parse(m[0]);
}

/* ===================== スコアリング & リアクション ===================== */
function scoreMeal(kcal, isUnagi, isCurry){
  let mult = 1;
  if(isUnagi && isCurry) mult = 1.8;
  else if(isUnagi) mult = 1.5;
  else if(isCurry) mult = 1.3;
  return { points: Math.round(kcal*mult), mult };
}
function bandReaction(cumKcal){
  if(cumKcal <= 500) return pick(R.a);
  if(cumKcal <= 1500) return pick(R.b);
  if(cumKcal <= 3000) return pick(R.c);
  if(cumKcal <= 4999) return pick(R.d);
  return pick(R.e);
}
function beatSpeed(cumKcal){
  // 累計が増えるほど速く（duration小）
  if(cumKcal <= 500) return "1.1s";
  if(cumKcal <= 1500) return ".85s";
  if(cumKcal <= 3000) return ".62s";
  if(cumKcal <= 4999) return ".42s";
  return ".26s";
}
const isSaladOnly = (foods) => foods.length>0 && foods.every(f=>/サラダ|野菜|salad|ベジ|グリーン/i.test(f.name||"")) ;

/* ===================== ドン太郎SVG（オリジナル：くいだおれ太郎と混同しないデザイン） ===================== */
function Dontaro({beat, speed}){
  return (
    <svg className={"dontaro"+(beat?" beat":"")} style={{"--beat":speed}} viewBox="0 0 120 150" aria-label="ドン太郎">
      {/* 太鼓（左手に抱える） */}
      <ellipse cx="30" cy="120" rx="20" ry="14" fill="#8a1420" stroke="#5a0c14" strokeWidth="2"/>
      <ellipse cx="30" cy="115" rx="18" ry="11" fill="#f3e3bf" stroke="#c8102e" strokeWidth="3"/>
      <circle cx="30" cy="115" r="4" fill="#c8102e"/>
      {/* 木製の体（法被） */}
      <rect x="40" y="78" width="44" height="52" rx="10" fill="#1e5aa8" stroke="#0f3a72" strokeWidth="2"/>
      {/* 法被の合わせ（赤白） */}
      <path d="M62 78 L62 130" stroke="#fff" strokeWidth="3"/>
      <path d="M56 82 L56 128" stroke="#ff2d3f" strokeWidth="4"/>
      {/* 帯（金） */}
      <rect x="40" y="108" width="44" height="8" fill="#f5c518" stroke="#b98900" strokeWidth="1.5"/>
      {/* 顔（木彫り・角ばった四角顔＝太郎と差別化） */}
      <rect x="44" y="40" width="36" height="40" rx="9" fill="#e6b877" stroke="#9c6b2e" strokeWidth="2.5"/>
      {/* ほお紅 */}
      <circle cx="50" cy="66" r="4" fill="#ff8a8a" opacity=".8"/>
      <circle cx="74" cy="66" r="4" fill="#ff8a8a" opacity=".8"/>
      {/* 太い一本眉（にっこり困り眉） */}
      <path d="M48 52 q14 -6 28 0" fill="none" stroke="#3a2410" strokeWidth="3.5" strokeLinecap="round"/>
      {/* 丸い黒目 */}
      <circle cx="54" cy="59" r="3.4" fill="#2a1607"/>
      <circle cx="70" cy="59" r="3.4" fill="#2a1607"/>
      {/* 大きく開いた口 */}
      <ellipse cx="62" cy="72" rx="7" ry="5" fill="#7a1420"/>
      {/* ねじり鉢巻（金×赤） */}
      <path d="M42 44 q20 -10 40 0" fill="none" stroke="#c8102e" strokeWidth="7" strokeLinecap="round"/>
      <path d="M42 44 q20 -7 40 0" fill="none" stroke="#f5c518" strokeWidth="3" strokeLinecap="round"/>
      <path d="M80 44 l10 -6 -2 8 z" fill="#c8102e"/>
      {/* 左腕（太鼓側） */}
      <rect x="34" y="92" width="12" height="26" rx="6" fill="#e6b877" stroke="#9c6b2e" strokeWidth="2"/>
      {/* 右腕＋バチ（叩く） */}
      <g className="arm-r">
        <rect x="78" y="92" width="12" height="30" rx="6" fill="#e6b877" stroke="#9c6b2e" strokeWidth="2"/>
        <rect x="82" y="118" width="6" height="18" rx="3" fill="#c99a5a" stroke="#8a5a1e" strokeWidth="1.5"/>
      </g>
      {/* 台座 */}
      <rect x="44" y="130" width="36" height="8" rx="3" fill="#5a3312"/>
    </svg>
  );
}

function DrumButton({onClick, disabled, label}){
  const tacks = [];
  const n=12;
  for(let i=0;i<n;i++){
    const ang = (i/n)*Math.PI*2;
    tacks.push(<i key={i} style={{left:`calc(50% + ${Math.cos(ang)*46}%)`,top:`calc(50% + ${Math.sin(ang)*46}%)`,transform:"translate(-50%,-50%)"}}/>);
  }
  return (
    <button className="drum-btn" onClick={onClick} disabled={disabled} aria-label={label}>
      <div className="drum-body">
        <div className="drum-tacks">{tacks}</div>
        <div style={{fontSize:34}}>📸</div>
        <div className="kanban" style={{fontSize:15,color:"#7a1420",marginTop:2}}>{label}</div>
      </div>
    </button>
  );
}

/* ===================== メーター ===================== */
function Meter({kcal}){
  const pct = Math.min(100, (kcal/5000)*100);
  const over = kcal >= 5000;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:4}}>
        <span className="kanban" style={{fontSize:15}}>食い倒れメーター{over && " 🔥"}</span>
        <span className="neon-gold" style={{fontWeight:900,fontSize:15}}>{kcal.toLocaleString()} / 5000 kcal</span>
      </div>
      <div className="meter-track">
        <div className={"meter-fill"+(over?" blaze":"")} style={{width:pct+"%"}}/>
      </div>
      {over
        ? <div style={{fontSize:11,color:"#ffb703",marginTop:3,fontWeight:800}}>🔥 認定超え！炎が止まらんで！</div>
        : <div style={{fontSize:11,color:"#c9a",marginTop:3}}>あと {(5000-kcal).toLocaleString()} kcal で食い倒れ認定！</div>}
    </div>
  );
}

/* ===================== 紙吹雪 ===================== */
function Confetti(){
  const cols = ["#ff2d3f","#f5c518","#ffffff","#ff7b00","#c8102e"];
  const pieces = useMemo(()=>Array.from({length:80}).map((_,i)=>({
    left: Math.random()*100,
    delay: Math.random()*1.2,
    dur: 2.2+Math.random()*2,
    col: cols[i%cols.length],
    rot: Math.random()*360,
  })),[]);
  return (<>{pieces.map((p,i)=>(
    <span key={i} className="confetti" style={{left:p.left+"%",background:p.col,animationDelay:p.delay+"s",animationDuration:p.dur+"s",transform:`rotate(${p.rot}deg)`}}/>
  ))}</>);
}

/* ===================== 認定証 ===================== */
function Certificate({day, streak, onClose}){
  return (
    <div className="overlay">
      <Confetti/>
      <div className="cert">
        <div className="kanban" style={{color:"#c8102e",fontSize:20}}>食 い 倒 れ 認 定 証</div>
        <div style={{fontSize:11,color:"#8a6b3a",margin:"2px 0 12px"}}>KUIDAORE CHAMPION</div>
        <div style={{fontSize:13,lineHeight:1.7,textAlign:"left",padding:"0 6px"}}>
          あなたは本日、胃袋の限界に挑み、<br/>
          見事 <b>5000kcal の壁</b> を打ち破りました。<br/>
          ここに「食い倒れ」の称号を授与します。
        </div>
        <div style={{margin:"14px 0",padding:"10px",borderTop:"1px dashed #c8102e",borderBottom:"1px dashed #c8102e"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"2px 0"}}><span>認定日</span><b>{day.date}</b></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"2px 0"}}><span>累計カロリー</span><b>{day.total_kcal.toLocaleString()} kcal</b></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"2px 0"}}><span>総ポイント</span><b>{day.total_points.toLocaleString()} pt</b></div>
          {streak>=2 && <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"2px 0",color:"#c8102e"}}><span>連続認定</span><b>{streak}日連続 🔥</b></div>}
        </div>
        <div style={{fontSize:11,color:"#8a6b3a"}}>採点：くいだおれ人形風オリジナルキャラ「ドン太郎」</div>
        <div className="seal">認定<br/>ドン太郎</div>
        <div style={{fontSize:11,color:"#a5794a",margin:"10px 0 12px"}}>📸 スクショで保存して自慢しよか！</div>
        <button className="btn btn-gold" style={{width:"100%"}} onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

/* ===================== 履歴 ===================== */
function calcStreak(store, uptoDate){
  // uptoDate を含めて過去に連続する certified 日数
  let count=0;
  let d = new Date(uptoDate);
  for(;;){
    const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    if(store[k] && store[k].certified){ count++; d.setDate(d.getDate()-1); }
    else break;
  }
  return count;
}
function bestStreak(store){
  const dates = Object.keys(store).filter(k=>store[k]&&store[k].certified).sort();
  let best=0, cur=0, prev=null;
  for(const ds of dates){
    const d = new Date(ds);
    if(prev){
      const diff = Math.round((d-prev)/86400000);
      cur = diff===1 ? cur+1 : 1;
    } else cur=1;
    best = Math.max(best,cur);
    prev = d;
  }
  return best;
}

function History({store, onBack}){
  const [ym, setYm] = useState(()=>{ const d=new Date(); return {y:d.getFullYear(), m:d.getMonth()}; });
  const first = new Date(ym.y, ym.m, 1);
  const startDow = first.getDay();
  const days = new Date(ym.y, ym.m+1, 0).getDate();
  const cells = [];
  for(let i=0;i<startDow;i++) cells.push(null);
  for(let d=1; d<=days; d++) cells.push(d);
  const certDays = Object.values(store).filter(x=>x&&x.certified).length;
  const tot = Object.values(store).reduce((a,x)=>a+(x&&x.total_kcal||0),0);

  return (
    <div style={{padding:"14px 14px 90px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <button className="btn btn-ghost" onClick={onBack} style={{padding:"8px 12px"}}>← 戻る</button>
        <span className="kanban" style={{fontSize:20}}>戦績カレンダー</span>
      </div>
      <div className="card" style={{marginBottom:12,display:"flex",justifyContent:"space-around",textAlign:"center"}}>
        <div><div className="neon-gold" style={{fontSize:22,fontWeight:900}}>{certDays}</div><div style={{fontSize:11,color:"#c9a"}}>認定日数 🏆</div></div>
        <div><div className="neon-gold" style={{fontSize:22,fontWeight:900}}>{bestStreak(store)}</div><div style={{fontSize:11,color:"#c9a"}}>最高連続記録 🔥</div></div>
        <div><div className="neon-gold" style={{fontSize:22,fontWeight:900}}>{Math.round(tot/1000)}k</div><div style={{fontSize:11,color:"#c9a"}}>総摂取kcal</div></div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <button className="btn btn-ghost" onClick={()=>setYm(p=>{const m=p.m-1; return m<0?{y:p.y-1,m:11}:{y:p.y,m};})} style={{padding:"6px 12px"}}>‹</button>
        <span className="kanban" style={{fontSize:16}}>{ym.y}年 {ym.m+1}月</span>
        <button className="btn btn-ghost" onClick={()=>setYm(p=>{const m=p.m+1; return m>11?{y:p.y+1,m:0}:{y:p.y,m};})} style={{padding:"6px 12px"}}>›</button>
      </div>
      <div className="cal-grid" style={{marginBottom:6}}>
        {["日","月","火","水","木","金","土"].map(w=><div key={w} style={{textAlign:"center",fontSize:11,color:"#c9a"}}>{w}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((d,i)=>{
          if(d===null) return <div key={i}/>;
          const ds = `${ym.y}-${String(ym.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const rec = store[ds];
          const cls = rec ? (rec.certified?"cert":(rec.total_kcal>0?"yarare":"")) : "";
          return (
            <div key={i} className={"cal-cell "+cls}>
              <span style={{opacity:.85}}>{d}</span>
              {rec && rec.certified && <span style={{fontSize:14}}>🏆</span>}
              {rec && !rec.certified && rec.total_kcal>0 && <span style={{fontSize:9,color:"#ff9aa8"}}>やられた</span>}
              {rec && rec.total_kcal>0 && <span style={{fontSize:8,color:"#e8cf9a"}}>{Math.round(rec.total_kcal)}</span>}
            </div>
          );
        })}
      </div>
      <div style={{fontSize:11,color:"#c9a",marginTop:12,lineHeight:1.6}}>
        🏆 = 食い倒れ認定（5000kcal到達）／「やられた」= 5000未満で日付が変わった未認定日。<br/>
        胃袋に負けた日も、立派な戦いの記録やで。
      </div>
    </div>
  );
}

/* ===================== 設定（APIキー） ===================== */
function Settings({apiKey, onSave, onClose}){
  const [v, setV] = useState(apiKey||"");
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card" style={{maxWidth:400,width:"100%"}} onClick={e=>e.stopPropagation()}>
        <div className="kanban" style={{fontSize:18,marginBottom:8}}>ドン太郎の設定</div>
        <div style={{fontSize:12,color:"#c9a",lineHeight:1.6,marginBottom:8}}>
          写真の採点には Anthropic の API キー（<code>sk-ant-...</code>）が必要や。
          キーはこの端末の localStorage にだけ保存され、採点時に直接 Anthropic へ送られる。サーバーは通さへんで。
          キーは <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">console.anthropic.com</a> で発行や。
        </div>
        <input className="txt" type="password" placeholder="sk-ant-..." value={v} onChange={e=>setV(e.target.value)} />
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button className="btn btn-gold" style={{flex:1}} onClick={()=>onSave(v.trim())}>保存</button>
          <button className="btn btn-ghost" style={{flex:1}} onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
}

/* ===================== メインアプリ ===================== */
function App(){
  const [store, setStore] = useState(loadStore);
  const [date, setDate] = useState(todayStr);
  const [apiKey, setApiKey] = useState(()=> localStorage.getItem("kuidaore_apikey")||"");
  const [view, setView] = useState("home"); // home | history
  const [showSettings, setShowSettings] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(()=> !localStorage.getItem("kuidaore_seen"));
  const [status, setStatus] = useState("idle"); // idle | analyzing | error
  const [errMsg, setErrMsg] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [reactions, setReactions] = useState([]); // {text, tag}
  const [rIndex, setRIndex] = useState(0);
  const [cert, setCert] = useState(null); // {day, streak}
  const fileRef = useRef(null);

  const day = store[date] || blankDay(date);

  // 日付が変わったら再読込
  useEffect(()=>{
    const iv = setInterval(()=>{
      const t = todayStr();
      if(t !== date){ setStore(loadStore()); setDate(t); }
    }, 30000);
    return ()=>clearInterval(iv);
  },[date]);

  // リアクション自動送り
  useEffect(()=>{
    if(reactions.length<=1) return;
    const iv = setInterval(()=> setRIndex(i=> (i+1) % reactions.length), 2800);
    return ()=>clearInterval(iv);
  },[reactions]);

  const beat = status==="analyzing" || reactions.length>0;
  const speed = beatSpeed(day.total_kcal);

  const saveApiKey = (k)=>{
    setApiKey(k);
    localStorage.setItem("kuidaore_apikey", k);
    setShowSettings(false);
  };

  const onPick = (e)=>{
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if(!file) return;
    if(!apiKey){ setShowSettings(true); return; }
    const reader = new FileReader();
    reader.onload = ()=> runAnalyze(reader.result, file.type||"image/jpeg");
    reader.readAsDataURL(file);
  };

  const runAnalyze = async (dataUrl, mediaType)=>{
    setStatus("analyzing");
    setErrMsg("");
    setLastResult(null);
    setReactions([{text:"採点中や…ドンドン…ドンドン…", tag:null}]);
    setRIndex(0);
    const base64 = dataUrl.split(",")[1];
    let mt = mediaType;
    if(!/^image\/(png|jpeg|gif|webp)$/.test(mt)) mt = "image/jpeg";
    try{
      const result = await analyze(apiKey, base64, mt);
      handleResult(result);
    }catch(err){
      setStatus("error");
      setErrMsg(String(err.message||err));
      setReactions([{text:"太鼓の調子が悪いわ、もっぺん撮ってくれるか？", tag:null}]);
      setRIndex(0);
    }
  };

  const handleResult = (result)=>{
    const foods = Array.isArray(result.foods) ? result.foods : [];
    const kcal = Math.max(0, Math.round(result.total_kcal || foods.reduce((a,f)=>a+(f.kcal||0),0)));
    const isUnagi = !!result.is_unagi;
    const isCurry = !!result.is_curry;
    const { points, mult } = scoreMeal(kcal, isUnagi, isCurry);

    // 当日レコード更新
    const cur = store[date] || blankDay(date);
    const wasCertified = cur.certified;
    const newKcal = cur.total_kcal + kcal;
    const newPoints = cur.total_points + points;
    const nowCertified = newKcal >= 5000;
    const meal = { time:new Date().toISOString(), foods, kcal, points, mult, is_unagi:isUnagi, is_curry:isCurry, confidence:result.confidence||"" };
    const updatedDay = { ...cur, meals:[...cur.meals, meal], total_kcal:newKcal, total_points:newPoints, certified:nowCertified };
    const newStore = { ...store, [date]: updatedDay };
    setStore(newStore);
    saveStore(newStore);

    setLastResult({ foods, kcal, points, mult, isUnagi, isCurry, confidence:result.confidence, addedKcal:kcal });
    setStatus("idle");

    // ===== リアクション生成 =====
    const seq = [];
    const hour = new Date().getHours();

    // 特殊条件
    if(foods.length===0 || kcal===0) seq.push({text:R.sp.nofood, tag:"special"});
    if(isSaladOnly(foods)) seq.push({text:R.sp.salad, tag:"special"});
    if(hour>=23 || hour<4) seq.push({text:R.sp.night, tag:"special"});
    if(hour>=6 && hour<9 && kcal>1000) seq.push({text:R.sp.morning, tag:"special"});

    // 鰻・カレー加算演出（2連発の1発目）
    if(isUnagi) seq.push({text:pick(R.unagi), tag:"unagi"});
    if(isCurry) seq.push({text:pick(R.curry), tag:"curry"});

    // 帯域別リアクション（2連発の2発目 / 常に最後）
    seq.push({text: bandReaction(newKcal), tag:null});

    setReactions(seq);
    setRIndex(0);

    // ===== 認定演出 =====
    if(nowCertified && !wasCertified){
      const streak = calcStreak(newStore, date);
      // 2日連続認定の特殊リアクション
      if(streak>=2){
        setReactions(s=>[{text:R.sp.streak, tag:"special"}, ...seq]);
      }
      setTimeout(()=> setCert({ day:updatedDay, streak }), 700);
    }
  };

  const dismissDisclaimer = ()=>{ localStorage.setItem("kuidaore_seen","1"); setShowDisclaimer(false); };

  if(view==="history") return (
    <div>
      <History store={store} onBack={()=>setView("home")} />
    </div>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      {/* ヘッダー */}
      <div style={{padding:"16px 14px 6px",textAlign:"center",position:"relative"}}>
        <div className="kanban" style={{fontSize:26,lineHeight:1.1}}>食い倒れ選手権</div>
        <div className="neon-gold kanban" style={{fontSize:13,letterSpacing:".2em"}}>〜 やるかやられるか 〜</div>
        <button className="btn btn-ghost" style={{position:"absolute",right:12,top:14,padding:"6px 10px",fontSize:12}} onClick={()=>setShowSettings(true)}>⚙️</button>
      </div>

      {/* メーター */}
      <div style={{padding:"6px 14px 4px"}}>
        <Meter kcal={day.total_kcal} />
      </div>

      {/* 撮影ボタン */}
      <div style={{padding:"18px 14px 6px",textAlign:"center",flex:"0 0 auto"}}>
        <DrumButton
          onClick={()=> fileRef.current && fileRef.current.click()}
          disabled={status==="analyzing"}
          label={status==="analyzing" ? "採点中…" : "太鼓を叩け"}
        />
        <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={onPick} />
        <div style={{fontSize:12,color:"#c9a",marginTop:10}}>
          料理の写真を撮る or アップロードで採点開始や
        </div>
      </div>

      {/* 結果レシート */}
      {lastResult && (
        <div style={{padding:"6px 14px 4px"}}>
          <div className="receipt">
            <div style={{textAlign:"center",fontWeight:900,letterSpacing:".3em",borderBottom:"2px solid #2a1607",paddingBottom:6,marginBottom:6}}>くいだおれ食堂</div>
            {lastResult.foods.length===0 && <div className="r-row"><span>（料理を検出できず）</span><span>0</span></div>}
            {lastResult.foods.map((f,i)=>(
              <div className="r-row" key={i}>
                <span style={{maxWidth:"64%"}}>{f.name}<br/><span style={{fontSize:11,color:"#7a5a2e"}}>{f.estimated_amount}</span></span>
                <span style={{whiteSpace:"nowrap"}}>{Math.round(f.kcal||0)} kcal</span>
              </div>
            ))}
            <div className="r-row" style={{fontSize:12}}>
              <span>この一皿</span><span>{lastResult.kcal.toLocaleString()} kcal</span>
            </div>
            {(lastResult.isUnagi || lastResult.isCurry) && (
              <div className="r-row" style={{color:"#c8102e",fontWeight:800}}>
                <span>{lastResult.isUnagi && lastResult.isCurry ? "🐟🍛 鰻カレー ×1.8 奇跡の一皿！" : lastResult.isUnagi ? "🐟 鰻ボーナス ×1.5" : "🍛 カレーボーナス ×1.3"}</span>
                <span>×{lastResult.mult}</span>
              </div>
            )}
            <div className="r-row r-tot">
              <span>獲得ポイント</span><span>{lastResult.points.toLocaleString()} pt</span>
            </div>
            <div style={{fontSize:10,color:"#7a5a2e",textAlign:"center",marginTop:6}}>
              本日累計 {day.total_kcal.toLocaleString()} kcal / {day.total_points.toLocaleString()} pt ・信頼度:{lastResult.confidence||"—"}
            </div>
          </div>
          <div className="zig"/>
        </div>
      )}

      {status==="error" && (
        <div style={{padding:"2px 14px"}}>
          <div style={{fontSize:11,color:"#ff9aa8",background:"rgba(120,20,30,.35)",borderRadius:8,padding:"8px 10px"}}>
            エラー: {errMsg}
          </div>
        </div>
      )}

      <div style={{flex:1}}/>

      {/* ドン太郎＋吹き出し */}
      <div style={{padding:"8px 14px 4px"}}>
        <div className="dontaro-wrap">
          <Dontaro beat={beat} speed={status==="analyzing" ? ".28s" : speed} />
          <div className="bubble">
            {status==="analyzing" && <span className="spin" style={{marginRight:6}}>🥁</span>}
            {reactions.length>0 ? (
              <span>
                {reactions[rIndex] && reactions[rIndex].tag && (
                  <span className={"tag "+reactions[rIndex].tag}>
                    {reactions[rIndex].tag==="unagi"?"鰻 ×1.5":reactions[rIndex].tag==="curry"?"カレー ×1.3":"特別"}
                  </span>
                )}
                {reactions[rIndex] ? reactions[rIndex].text : ""}
              </span>
            ) : (
              <span>わしはドン太郎。さあ、胃袋の限界に挑むんや。<b>5000kcal</b>で食い倒れ認定やで！やるか、やられるか——。</span>
            )}
            {reactions.length>1 && (
              <div style={{marginTop:6,display:"flex",gap:4}}>
                {reactions.map((_,i)=>(<span key={i} style={{width:6,height:6,borderRadius:3,background:i===rIndex?"#c8102e":"#c9a"}}/>))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* タブバー */}
      <div className="tabbar">
        <button className="btn" onClick={()=> fileRef.current && fileRef.current.click()}>🥁 採点する</button>
        <button className="btn btn-gold" onClick={()=>setView("history")}>📅 戦績</button>
      </div>

      {/* オーバーレイ類 */}
      {cert && <Certificate day={cert.day} streak={cert.streak} onClose={()=>setCert(null)} />}
      {showSettings && <Settings apiKey={apiKey} onSave={saveApiKey} onClose={()=>setShowSettings(false)} />}
      {showDisclaimer && (
        <div className="modal-bg">
          <div className="card" style={{maxWidth:400,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:40}}>🥁</div>
            <div className="kanban" style={{fontSize:20,margin:"6px 0"}}>ようこそ、食い倒れの道へ</div>
            <div style={{fontSize:13,color:"#e8cf9a",lineHeight:1.7,margin:"8px 0 14px"}}>
              食べ物の写真を撮ったら、ドン太郎が量とカロリーを推定して採点するで。<br/>1日の累計が<b>5000kcal</b>に届いたら「食い倒れ認定」や！
            </div>
            <div style={{fontSize:11,color:"#ff9aa8",background:"rgba(120,20,30,.3)",borderRadius:8,padding:"8px 10px",lineHeight:1.6}}>
              ※推定値はドン太郎の勘や。医療・栄養管理には使わんといてな。<br/>これは過食を勧めるアプリやのうて、あくまでジョークやで。無理はせんように。
            </div>
            <button className="btn btn-gold" style={{width:"100%",marginTop:14}} onClick={dismissDisclaimer}>よっしゃ、いくで！</button>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
