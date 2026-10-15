import {
  formatDate,
  locationLabel,
  movementClasses,
  movementDelta,
  movementLabels,
} from "../../../utils/formatters";
import type { Product, StockMovement } from "../../../types/inventory";

export interface MovementLedgerProps {
  movements: StockMovement[];
  products: Product[];
}

export function MovementLedger({ movements, products }: MovementLedgerProps) {
  if (movements.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center text-xs text-slate-400">
        No stock movements recorded yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Recent Movements ({movements.length})
        </h2>
      </div>
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-medium text-slate-400 uppercase">
          <tr>
            <th className="px-5 py-3">Timestamp</th>
            <th className="px-5 py-3">Product</th>
            <th className="px-5 py-3">Type</th>
            <th className="px-5 py-3">Delta</th>
            <th className="px-5 py-3">Location</th>
            <th className="px-5 py-3">Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {movements.map((movement) => {
            const product = products.find(
              (item) => item.id === movement.productId,
            );
            const delta = movementDelta(movement.type, movement.quantity);
            return (
              <tr key={movement.id} className="transition hover:bg-slate-50/75">
                <td className="px-5 py-3.5 text-slate-400">
                  {formatDate(movement.createdAt)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-slate-900">
                    {product?.name ?? movement.productId}
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    {product?.sku}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex rounded px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${movementClasses[movement.type]}`}
                  >
                    {movementLabels[movement.type]}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-semibold">
                  <span
                    className={
                      delta > 0 ? "text-emerald-600" : "text-rose-600"
                    }
                  >
                    {delta > 0 ? `+${delta}` : delta} {product?.unit ?? "un"}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                  {locationLabel(movement.location)}
                </td>
                <td className="px-5 py-3.5 text-slate-500">
                  {movement.note || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
