import { ArrowRight } from "lucide-react";
import { StockBadge } from "../../../components/ui";
import { formatCurrency, locationLabel } from "../../../utils/formatters";
import type { Product } from "../../../types/inventory";

export interface ProductTableProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onReceive: (productId?: string) => void;
}

export function ProductTable({
  products,
  onSelectProduct,
  onReceive,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white py-12 text-center text-xs text-slate-400">
        No products match your search query.
      </div>
    );
  }

  return (
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
  );
}
