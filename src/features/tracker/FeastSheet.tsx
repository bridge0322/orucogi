import { useState } from "react";
import { Button } from "../../design-system/Button";
import { Input } from "../../design-system/Input";
import { Badge } from "../../design-system/Badge";
import { Sheet } from "./Sheet";
import { YEN } from "./logic/format";
import type { CrashState } from "./logic/feast";

export interface FeastSheetProps {
  crash: CrashState;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const presets = [10000, 30000, 50000, 100000];

export function FeastSheet({ crash, onClose, onConfirm }: FeastSheetProps) {
  const [amt, setAmt] = useState(30000);
  const food = crash.food!;
  return (
    <Sheet onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 46, lineHeight: 1, filter: food.gold ? "drop-shadow(0 0 8px #F2C14E)" : "none" }}>{food.emoji}</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "var(--text-xl)", color: "var(--text-strong)", marginTop: 6 }}>{food.name}をあげる</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          <Badge tone="negative">高値から {crash.dd.toFixed(1)}%</Badge>
          <Badge tone="brand">+{food.xp} けいけんち</Badge>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--text-muted)", textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
          安いときの追加つみたては、コギの大好物。<br />入力した金額は元本＋評価額に反映されます。
        </div>
      </div>
      <Input label="追加でつみたてる金額" prefix="¥" inputMode="numeric" value={YEN(amt)} readOnly size="lg" style={{ marginBottom: 12 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
        {presets.map((p) => (
          <button key={p} onClick={() => setAmt(p)} style={{ padding: "10px 0", borderRadius: "var(--radius-pill)", border: `2px solid ${amt === p ? "var(--brand)" : "var(--border-strong)"}`, background: amt === p ? "var(--brand-soft)" : "var(--surface-card)", color: amt === p ? "var(--text-brand)" : "var(--text-body)", fontFamily: "var(--font-number)", fontWeight: 700, fontSize: "var(--text-sm)", cursor: "pointer" }}>
            {p >= 10000 ? `${p / 10000}万` : YEN(p)}
          </button>
        ))}
      </div>
      <Button variant="primary" size="lg" fullWidth onClick={() => onConfirm(amt)} iconLeft={<i className="ph-fill ph-bone" />}>
        {food.name}をあげる
      </Button>
    </Sheet>
  );
}
