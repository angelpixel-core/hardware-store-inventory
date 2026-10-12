import { MapPin, Plus, X } from "lucide-react";
import { Info, StockBadge } from "../../components/ui";
import {
  formatCurrency,
  formatDate,
  locationLabel,
  movementClasses,
  movementDelta,
  movementLabels,
} from "../../utils/formatters";
import type { Product, StockMovement } from "../../types/inventory";

export interface ProductDrawerProps {
  product: Product;
  movements: StockMovement[];
  onClose: () => void;
  onReceive: (productId: string) => void;
}

export function ProductDrawer({
  product,
  movements,
  onClose,
  onReceive,
}: ProductDrawerProps) {
  const margin = Math.round(
    ((product.price - product.cost) / product.price) * 100,
  );
  const productMovements = movements.filter(
    (item) => item.productId === product.id,
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/20 backdrop-blur-xs">
      <div className="flex h-full w-[440px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="text-xs text-slate-400">{product.brand}</div>
            <h2 className="text-base font-semibold text-slate-900">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-2 gap-3">
            <Info label="SKU" value={product.sku} />
            <Info label="Barcode" value={product.barcode} />
            <Info label="Retail Price" value={formatCurrency(product.price)} />
            <Info label="Cost" value={formatCurrency(product.cost)} />
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Current Stock</div>
                <div className="mt-1 flex items-center gap-2">
                  <StockBadge
                    stock={product.stock}
                    minimum={product.minimumStock}
                    unit={product.unit}
                  />
                  <span className="text-xs text-slate-400">
                    min: {product.minimumStock} {product.unit}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onReceive(product.id)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
              >
                <Plus size={14} /> Receive
              </button>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              Margin: <span className="font-medium text-slate-700">{margin}%</span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
            <MapPin size={16} className="mt-0.5 text-slate-400 shrink-0" />
            <div className="text-xs">
              <div className="font-medium text-slate-700">Storage Location</div>
              <div className="mt-0.5 font-mono text-slate-500">
                {product.location.store} · {locationLabel(product.location)}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Movement History ({productMovements.length})
            </div>
            {productMovements.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400">
                No recorded stock movements for this item.
              </div>
            ) : (
              <div className="space-y-2">
                {productMovements.map((movement) => {
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
                        {delta > 0 ? `+${delta}` : delta} {product.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
