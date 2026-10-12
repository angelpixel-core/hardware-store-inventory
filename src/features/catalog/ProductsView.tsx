import { ArrowRight, Plus, Search } from "lucide-react";
import { StockBadge } from "../../components/ui";
import { formatCurrency, locationLabel } from "../../utils/formatters";
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

      <div className="relative mb-5 max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search name, brand, category, SKU, barcode..."
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-slate-400"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-medium text-slate-400 uppercase">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className="cursor-pointer transition hover:bg-slate-50/75"
              >
                <td className="px-5 py-3.5">
                  <div className="font-medium text-slate-900">{product.name}</div>
                  <div className="text-[11px] text-slate-400">{product.brand}</div>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{product.category}</td>
                <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                  {product.sku}
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-800">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-5 py-3.5">
                  <StockBadge
                    stock={product.stock}
                    minimum={product.minimumStock}
                    unit={product.unit}
                  />
                </td>
                <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                  {locationLabel(product.location)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onReceive(product.id);
                    }}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Receive <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
