import {
  formatDate,
  movementClasses,
  movementDelta,
  movementLabels,
} from "../../../utils/formatters";
import type { StockMovement } from "../../../types/inventory";

export interface MovementTimelineProps {
  movements: StockMovement[];
  unit: string;
}

export function MovementTimeline({ movements, unit }: MovementTimelineProps) {
  return (
    <div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Movement History ({movements.length})
      </div>
      {movements.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400">
          No recorded stock movements for this item.
        </div>
      ) : (
        <div className="space-y-2">
          {movements.map((movement) => {
            const delta = movementDelta(movement.type, movement.quantity);
            return (
              <div
                key={movement.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${movementClasses[movement.type]}`}
                  >
                    {movementLabels[movement.type]}
                  </span>
                  <div>
                    <div className="text-slate-500">
                      {movement.note || "No notes"}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatDate(movement.createdAt)}
                    </div>
                  </div>
                </div>
                <span
                  className={`font-semibold ${delta > 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {delta > 0 ? `+${delta}` : delta} {unit}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
