import { X } from "lucide-react";
import { MovementTimeline, ProductInfoGrid } from "./components";
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
          <ProductInfoGrid product={product} onReceive={onReceive} />

          <MovementTimeline
            movements={productMovements}
            unit={product.unit}
          />
        </div>
      </div>
    </div>
  );
}
