import {
  ArrowRightLeft,
  ExternalLink,
  MapPin,
  PackageOpen,
  Plus,
} from "lucide-react";
import type { Product } from "../../../types/inventory";
import { formatCurrency, locationLabel } from "../../../utils/formatters";

export interface ShelfContentsListProps {
  products: Product[];
  selectedAisleId: string;
  selectedRackId: string | null;
  onSelectProduct: (id: string) => void;
  onReceive: (productId: string) => void;
  onOpenRelocate: (product: Product) => void;
}

export function ShelfContentsList({
  products,
  selectedAisleId,
  selectedRackId,
  onSelectProduct,
  onReceive,
  onOpenRelocate,
}: ShelfContentsListProps) {
  const scopeTitle = selectedRackId
    ? `Artículos en Pasillo ${selectedAisleId} • Rack ${selectedRackId}`
    : `Artículos en Pasillo ${selectedAisleId}`;

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{scopeTitle}</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Inventario físico asignado a esta posición geográfica
          </p>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
          {products.length} productos
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-slate-400">
          <PackageOpen size={24} className="mb-2 text-slate-300" />
          No hay artículos registrados en esta sección del local.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 rounded-lg px-2 transition"
            >
              <div
                onClick={() => onSelectProduct(p.id)}
                className="cursor-pointer space-y-0.5 group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                    {p.name}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                    {p.sku}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{p.brand}</span>
                  <span>•</span>
                  <span>{p.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-indigo-700">
                    <MapPin size={11} /> {locationLabel(p.location)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">
                    {p.stock}{" "}
                    <span className="text-[11px] font-normal text-slate-500">
                      {p.unit}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    PVP: {formatCurrency(p.price)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onReceive(p.id)}
                    className="flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                    title="Recibir stock en este lugar"
                  >
                    <Plus size={13} /> Recibir
                  </button>

                  <button
                    onClick={() => onOpenRelocate(p)}
                    className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                    title="Reubicar producto en otro pasillo o estante"
                  >
                    <ArrowRightLeft size={13} /> Reubicar
                  </button>

                  <button
                    onClick={() => onSelectProduct(p.id)}
                    className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                    title="Ver ficha técnica"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
