import { Clock, History } from "lucide-react";
import type { Product, StockMovement } from "../../../types/inventory";
import {
  formatDate,
  movementClasses,
  movementDelta,
  movementLabels,
} from "../../../utils/formatters";

export interface RecentActivityFeedProps {
  movements: StockMovement[];
  products: Product[];
  onViewInventory: () => void;
}

export function RecentActivityFeed({
  movements,
  products,
  onViewInventory,
}: RecentActivityFeedProps) {
  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Transacciones Recientes del Kardex
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Últimas operaciones registradas en el almacén
          </p>
        </div>
        <button
          onClick={onViewInventory}
          className="flex items-center gap-1 text-xs font-medium text-slate-600 transition hover:text-slate-900"
        >
          <History size={13} /> Ver historial →
        </button>
      </div>

      {movements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400">
          <Clock size={20} className="mb-2 text-slate-300" />
          No hay movimientos recientes registrados.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {movements.map((mov) => {
            const product = productMap.get(mov.productId);
            const delta = movementDelta(mov.type, mov.quantity);
            const deltaLabel = delta > 0 ? `+${delta}` : `${delta}`;

            return (
              <div
                key={mov.id}
                className="flex items-center justify-between py-2.5"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                        movementClasses[mov.type]
                      }`}
                    >
                      {movementLabels[mov.type]}
                    </span>
                    <span className="text-xs font-medium text-slate-900">
                      {product?.name ?? mov.productId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{formatDate(mov.createdAt)}</span>
                    {mov.note && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[200px] text-slate-500">
                          {mov.note}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      delta > 0 ? "text-emerald-600" : "text-slate-800"
                    }`}
                  >
                    {deltaLabel} {product?.unit ?? "un"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
