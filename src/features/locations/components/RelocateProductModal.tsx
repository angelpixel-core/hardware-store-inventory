import { ArrowRightLeft, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product, ProductLocation } from "../../../types/inventory";
import { locationLabel } from "../../../utils/formatters";

export interface RelocateProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (newLocation: ProductLocation) => void;
}

export function RelocateProductModal({
  isOpen,
  product,
  onClose,
  onConfirm,
}: RelocateProductModalProps) {
  const [store, setStore] = useState("Principal");
  const [aisle, setAisle] = useState("A1");
  const [rack, setRack] = useState("R1");
  const [shelf, setShelf] = useState("S1");

  useEffect(() => {
    if (product) {
      setStore(product.location.store || "Principal");
      setAisle(product.location.aisle || "A1");
      setRack(product.location.rack || "R1");
      setShelf(product.location.shelf || "S1");
    }
  }, [product]);

  if (!isOpen || !product) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm({
      store: store.trim() || "Principal",
      aisle: aisle.trim().toUpperCase(),
      rack: rack.trim().toUpperCase(),
      shelf: shelf.trim().toUpperCase(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ArrowRightLeft size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Reubicar Producto
              </h2>
              <p className="text-[11px] text-slate-500">
                Modificar coordenadas de almacenamiento físico
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Product Summary */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-3 text-xs">
          <div className="font-semibold text-slate-900">{product.name}</div>
          <div className="mt-1 flex items-center gap-2 text-slate-500">
            <span className="font-mono text-[10px] text-slate-600">
              {product.sku}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-600">
              <MapPin size={11} /> Ubicación actual: {locationLabel(product.location)}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* Sucursal / Depósito */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Sucursal / Almacén
            </label>
            <input
              type="text"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Pasillo */}
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Pasillo
              </label>
              <select
                value={aisle}
                onChange={(e) => setAisle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-hidden"
              >
                <option value="A1">A1 (Herramientas eléctricas)</option>
                <option value="A2">A2 (Herramientas manuales)</option>
                <option value="A3">A3 (Fijaciones y tornillos)</option>
                <option value="A4">A4 (Plomería y grifería)</option>
                <option value="A5">A5 (Electricidad)</option>
                <option value="A6">A6 (Pinturas)</option>
                <option value="A7">A7 (Construcción)</option>
              </select>
            </div>

            {/* Rack */}
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Rack
              </label>
              <input
                type="text"
                value={rack}
                onChange={(e) => setRack(e.target.value)}
                placeholder="Ej: R1"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs uppercase text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Shelf */}
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Estante
              </label>
              <input
                type="text"
                value={shelf}
                onChange={(e) => setShelf(e.target.value)}
                placeholder="Ej: S2"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs uppercase text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="mt-6 flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
            >
              Confirmar Reubicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
