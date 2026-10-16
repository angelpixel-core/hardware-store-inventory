import { Plus, PackagePlus } from "lucide-react";
import { useState, useMemo } from "react";
import { CatalogSearchBar, ProductTable, CreateProductModal } from "./components";
import type { Product } from "../../types/inventory";
import type { CreateProductInput } from "../../hooks/useInventoryState";

export interface ProductsViewProps {
  products: Product[];
  search: string;
  onSearch: (value: string) => void;
  onSelectProduct: (id: string) => void;
  onReceive: (productId?: string) => void;
  onCreateProduct?: (input: CreateProductInput) => void;
}

export function ProductsView({
  products,
  search,
  onSearch,
  onSelectProduct,
  onReceive,
  onCreateProduct,
}: ProductsViewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Catálogo de Productos</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Ficha maestra de especificaciones técnicas, precios sugeridos y ubicaciones asignadas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onReceive()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Plus size={15} /> Recepción de stock
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
          >
            <PackagePlus size={15} /> + Nuevo Producto
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
            selectedCategory === "all"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Todas las categorías ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      <CatalogSearchBar value={search} onChange={onSearch} />

      <ProductTable
        products={filteredProducts}
        onSelectProduct={onSelectProduct}
        onReceive={onReceive}
      />

      {isCreateOpen && (
        <CreateProductModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(input) => {
            onCreateProduct?.(input);
          }}
        />
      )}
    </div>
  );
}

