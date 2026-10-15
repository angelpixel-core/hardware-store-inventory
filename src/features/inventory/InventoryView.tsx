import { Plus } from "lucide-react";
import { MetricsCards, MovementLedger } from "./components";
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

      <MetricsCards
        totalUnits={totalUnits}
        productCount={products.length}
        lowStockCount={lowStockCount}
      />

      <MovementLedger movements={movements} products={products} />
    </div>
  );
}
