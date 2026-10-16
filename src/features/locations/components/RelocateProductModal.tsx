import { ArrowRightLeft, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "../../../i18n";
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
  const { t } = useTranslation();
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
                {t.relocateProduct.title}
              </h2>
              <p className="text-[11px] text-slate-500">
                {t.relocateProduct.subtitle}
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

        {/* Product Context */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3">
          <div className="text-xs font-semibold text-slate-900">
            {product.name}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="font-mono text-slate-600">{product.sku}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin size={11} /> {t.relocateProduct.currentLocation} {locationLabel(product.location)}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="space-y-4">
            {/* Store (Sucursal/Almacén) */}
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Almacén / Depósito
              </label>
              <input
                type="text"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                placeholder="Principal"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Aisle */}
            <div>
              <label className="block text-xs font-medium text-slate-700">
                {t.relocateProduct.aisle}
              </label>
              <select
                value={aisle}
                onChange={(e) => setAisle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
              >
                {["A1", "A2", "A3", "A4", "A5", "A6", "A7"].map((a) => (
                  <option key={a} value={a}>
                    Pasillo {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Rack */}
            <div>
              <label className="block text-xs font-medium text-slate-700">
                {t.relocateProduct.shelf}
              </label>
              <input
                type="text"
                value={rack}
                onChange={(e) => setRack(e.target.value)}
                placeholder="R1"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs uppercase text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                required
              />
            </div>

            {/* Shelf */}
            <div>
              <label className="block text-xs font-medium text-slate-700">
                {t.relocateProduct.level}
              </label>
              <input
                type="text"
                value={shelf}
                onChange={(e) => setShelf(e.target.value)}
                placeholder="S1"
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
              {t.relocateProduct.cancelBtn}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
            >
              {t.relocateProduct.submitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
