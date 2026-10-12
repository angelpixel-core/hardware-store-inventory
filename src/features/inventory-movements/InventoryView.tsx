import { AlertTriangle, Package, Plus } from "lucide-react";
import { SummaryCard } from "../../components/ui";
import {
  formatDate,
  locationLabel,
  movementClasses,
  movementDelta,
  movementLabels,
} from "../../utils/formatters";
import type { Product, StockMovement } from "../../types/inventory";

export interface InventoryViewProps {
  products: Product[];
  movements: StockMovement[];
  onReceive: () => void;
}

export function InventoryView({
  products,
  movements,
  onReceive,
}: InventoryViewProps) {
  const totalUnits = products.reduce((acc, item) => acc + item.stock, 0);
  const lowStockCount = products.filter(
    (item) => item.stock <= item.minimumStock,
  ).length;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Inventory</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Stock movements log, quantity changes, and intake transactions.
          </p>
        </div>
        <button
          onClick={onReceive}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={15} /> Receive stock
        </button>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <SummaryCard
          label="Total Units in Store"
          value={totalUnits.toLocaleString("es-AR")}
          icon={<Package size={17} />}
        />
        <SummaryCard
          label="Active Products"
          value={products.length.toString()}
          icon={<Package size={17} />}
        />
        <SummaryCard
          label="Low Stock Items"
          value={lowStockCount.toString()}
          icon={<AlertTriangle size={17} />}
          warning={lowStockCount > 0}
        />
      </div>

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
    </div>
  );
}
