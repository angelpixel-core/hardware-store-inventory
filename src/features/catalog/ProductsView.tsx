import { Plus } from "lucide-react";
import { CatalogSearchBar, ProductTable } from "./components";
import type { Product } from "../../types/inventory";

export interface ProductsViewProps {
  products: Product[];
  search: string;
  onSearch: (value: string) => void;
  onSelectProduct: (id: string) => void;
  onReceive: (productId?: string) => void;
}

export function ProductsView({
  products,
  search,
  onSearch,
  onSelectProduct,
  onReceive,
}: ProductsViewProps) {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Products</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Real-time catalog, stock status, and physical store placement.
          </p>
        </div>
        <button
          onClick={() => onReceive()}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={15} /> Receive stock
        </button>
      </div>

      <CatalogSearchBar value={search} onChange={onSearch} />

      <ProductTable
        products={products}
        onSelectProduct={onSelectProduct}
        onReceive={onReceive}
      />
    </div>
  );
}
