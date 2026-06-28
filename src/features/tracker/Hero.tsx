import { Card } from "../../design-system/Card";
import { Badge } from "../../design-system/Badge";
import { CorgiRoom } from "../../design-system/CorgiRoom";
import { ProgressBar } from "../../design-system/ProgressBar";
import { Button } from "../../design-system/Button";
import { WeatherScene } from "./WeatherScene";
import { condFor, condTone } from "./logic/conditions";
import { crashState } from "./logic/feast";
import { ROOM_STAGES, roomLevelFromAmount } from "./logic/roomStages";
import { YEN } from "./logic/format";
import type { Record_ } from "./logic/persistence";

export interface HeroProps {
  cur: Record_;
  peak: number;
  onFeed: () => void;
}

export function Hero({ cur, peak, onFeed }: HeroProps) {
  const gain = cur.value - cur.principal;
  const rate = cur.principal > 0 ? (gain / cur.principal) * 100 : 0;
  const cond = condFor(rate);
  const lv = roomLevelFromAmount(cur.principal);
  const st = ROOM_STAGES[lv - 1];
  const nextSt = ROOM_STAGES[lv] || null;
  const toNext = nextSt ? Math.min(100, Math.round(((cur.principal - st.amount) / (nextSt.amount - st.amount)) * 100)) : 100;

  const crash = crashState(cur.value, peak);
  const inEvent = crash.level >= 1 && crash.food;

  return (
    <Card tone="fur" elevation="md" padding="14px" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 4px 0" }}>
        <Badge tone="brand">Lv.{lv} {st.name}</Badge>
        {inEvent
          ? <Badge tone="negative"><i className="ph-fill ph-bowl-food" style={{ marginRight: 3 }} />おなかすいた</Badge>
          : <Badge tone={condTone(cond.key)}>{cond.label}</Badge>}
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--text-muted)", fontWeight: 700 }}>
          {inEvent ? `高値から ${crash.dd.toFixed(1)}%` : "タップであそぶ 🐾"}
        </span>
      </div>

      {inEvent ? <WeatherScene state={crash} /> : <CorgiRoom amount={cur.principal} height={236} />}

      {inEvent && crash.food && (
        <div style={{ background: crash.food.gold ? "linear-gradient(120deg,#FCEFC3,#F7D774)" : "var(--surface-card)", border: `2px solid ${crash.food.gold ? "#E6B422" : "var(--border)"}`, borderRadius: "var(--radius-md)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 34, lineHeight: 1, filter: crash.food.gold ? "drop-shadow(0 0 6px #F2C14E)" : "none" }}>{crash.food.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "var(--text-base)", color: "var(--text-strong)" }}>
              「{crash.food.name}」が解放されたワン！
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 1 }}>
              いまだけの特別ごはん。追加でつみたてて、コギにあげよう
            </div>
          </div>
          <Button variant="primary" size="md" onClick={onFeed} iconLeft={<i className="ph-fill ph-bone" />}>あげる</Button>
        </div>
      )}

      <div style={{ padding: "0 4px" }}>
        <ProgressBar value={toNext} color="var(--brand)"
          label={nextSt ? <span>次の <b style={{ color: "var(--text-brand)" }}>{nextSt.name}</b> まで 積立 あと ¥{YEN(nextSt.amount - cur.principal)}</span> : "最高ステージに到達！"}
          showValue={!!nextSt} />
      </div>
    </Card>
  );
}
