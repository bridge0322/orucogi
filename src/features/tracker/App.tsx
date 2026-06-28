import { useEffect, useState } from "react";
import { Button } from "../../design-system/Button";
import { BottomNav } from "../../design-system/BottomNav";
import { Card } from "../../design-system/Card";
import { Hero } from "./Hero";
import { BalanceCard } from "./BalanceCard";
import { RecordSheet } from "./RecordSheet";
import { ImportSheet } from "./ImportSheet";
import { HistoryScreen } from "./HistoryScreen";
import { FeastSheet } from "./FeastSheet";
import { FeastCelebration } from "./FeastCelebration";
import { loadData, saveData } from "./logic/persistence";
import type { TrackerData } from "./logic/persistence";
import { crashState, peakOf, xpInLevel, xpLevel } from "./logic/feast";
import type { Food } from "./logic/feast";

type SheetKind = "record" | "import" | "feast" | null;

interface FeastFx {
  food: Food;
  amount: number;
  gainedXp: number;
}

export function App() {
  const [data, setData] = useState<TrackerData>(loadData);
  const [tab, setTab] = useState("home");
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [feastFx, setFeastFx] = useState<FeastFx | null>(null);
  const cur = data.records[data.records.length - 1];
  const peak = peakOf(data.records);
  const crash = crashState(cur.value, peak);

  useEffect(() => { saveData(data); }, [data]);

  const addRecord = ({ principal, value }: { principal: number | null; value: number }) => {
    setData((d) => {
      const prev = d.records[d.records.length - 1];
      const p = principal == null ? prev.principal : principal;
      return { ...d, records: [...d.records, { t: Date.now(), principal: p, value }] };
    });
    setSheet(null);
  };

  const feed = (amount: number) => {
    const food = crash.food;
    if (!food) return;
    setSheet(null);
    setData((d) => {
      const prev = d.records[d.records.length - 1];
      return {
        ...d,
        xp: (d.xp || 0) + food.xp,
        feasts: [...(d.feasts || []), { t: Date.now(), food: food.name, rank: food.rank, amount }],
        records: [...d.records, { t: Date.now(), principal: prev.principal + amount, value: prev.value + amount }],
      };
    });
    setFeastFx({ food, amount, gainedXp: food.xp });
  };

  const lvl = xpLevel(data.xp);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "var(--surface-app)", display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "calc(12px + env(safe-area-inset-top,0px)) 20px 12px" }}>
        <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "var(--text-2xl)", color: "var(--text-strong)" }}>オルコギ</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--text-brand)", fontWeight: 800 }}>
          <i className="ph-fill ph-star" /> おやつLv.{lvl}
        </div>
      </header>

      <main style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px" }}>
        {tab === "home" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Hero cur={cur} peak={peak} onFeed={() => setSheet("feast")} />
            <BalanceCard cur={cur} />
            <Card elevation="sm" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, flex: "none", borderRadius: "var(--radius-md)", background: "var(--brand-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⭐</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-strong)" }}>おやつマスター Lv.{lvl}</span>
                  <span style={{ fontFamily: "var(--font-number)", fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{xpInLevel(data.xp)}/300</span>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: "var(--cream-200)", overflow: "hidden", boxShadow: "var(--shadow-inset)" }}>
                  <div style={{ width: `${(xpInLevel(data.xp) / 300) * 100}%`, height: "100%", borderRadius: 999, background: "var(--brand)" }} />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-number)", fontWeight: 800, fontSize: "var(--text-md)", color: "var(--text-brand)", lineHeight: 1 }}>{data.feasts.length}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-muted)", fontWeight: 700 }}>ごはん回数</div>
              </div>
            </Card>
            <div style={{ display: "flex", gap: 12 }}>
              <Button variant="primary" size="lg" fullWidth onClick={() => setSheet("record")} iconLeft={<i className="ph-fill ph-pencil-simple" />}>記録する</Button>
              <Button variant="secondary" size="lg" fullWidth onClick={() => setSheet("import")} iconLeft={<i className="ph ph-download-simple" />}>取り込む</Button>
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
              データはこの端末のブラウザ内にのみ保存されます。<br />サーバー送信・ログインはありません。
            </div>
          </div>
        )}
        {tab === "history" && <HistoryScreen data={data} />}
      </main>

      <BottomNav value={tab} onChange={setTab} items={[
        { key: "home", label: "ホーム", icon: "ph ph-house" },
        { key: "history", label: "きろく", icon: "ph ph-chart-line-up" },
      ]} />

      {sheet === "record" && <RecordSheet cur={cur} onClose={() => setSheet(null)} onSave={addRecord} />}
      {sheet === "import" && <ImportSheet onClose={() => setSheet(null)} onSave={addRecord} />}
      {sheet === "feast" && crash.food && <FeastSheet crash={crash} onClose={() => setSheet(null)} onConfirm={feed} />}
      {feastFx && <FeastCelebration {...feastFx} onDone={() => setFeastFx(null)} />}
    </div>
  );
}
