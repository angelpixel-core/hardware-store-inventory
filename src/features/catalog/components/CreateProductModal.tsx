import { PackagePlus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { CreateProductInput } from "../../../hooks/useInventoryState";

export interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateProductInput) => void;
}

const CATEGORIES = [
  "Herramientas eléctricas",
  "Herramientas manuales",
  "Fijaciones y tornillería",
  "Plomería y grifería",
  "Electricidad e iluminación",
  "Pinturas y adhesivos",
  "Construcción y corralón",
];

const UNITS = ["un", "kg", "mts", "jgo", "litro", "caja", "pack"];

export function CreateProductModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProductModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [unit, setUnit] = useState("un");
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [stock, setStock] = useState(0);
  const [minimumStock, setMinimumStock] = useState(3);
  const [aisle, setAisle] = useState("A1");
  const [rack, setRack] = useState("R1");
  const [shelf, setShelf] = useState("S1");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  function generateSku() {
    const brandPrefix = (brand.trim() || "PRD").slice(0, 3).toUpperCase();
    const namePart = name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w.slice(0, 3).toUpperCase())
      .join("-");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setSku(`${brandPrefix}-${namePart || "ITM"}-${randomSuffix}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    onSubmit({
      name: name.trim(),
      brand: brand.trim() || "Genérico",
      category,
      sku: sku.trim().toUpperCase(),
      barcode: barcode.trim() || `779${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      unit,
      price: Number(price) || 0,
      cost: Number(cost) || 0,
      stock: Number(stock) || 0,
      minimumStock: Number(minimumStock) || 1,
      location: {
        store: "Principal",
        aisle,
        rack: rack.trim().toUpperCase() || "R1",
        shelf: shelf.trim().toUpperCase() || "S1",
      },
      description: description.trim() || name.trim(),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <PackagePlus size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Alta de Producto en Catálogo
              </h2>
              <p className="text-[11px] text-slate-500">
                Ficha maestra de especificaciones técnicas, precios y ubicación
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Identificación */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Taladro Percutor Inalámbrico 18V"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Marca / Fabricante
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Bosch, Stanley, Makita"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Categoría Comercial
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-900 focus:border-slate-900 focus:outline-hidden"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SKU, Barcode & Unidad */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-700">
                  SKU *
                </label>
                <button
                  type="button"
                  onClick={generateSku}
                  className="flex items-center gap-0.5 text-[10px] font-medium text-indigo-600 hover:text-indigo-800"
                >
                  <Sparkles size={11} /> Generar
                </button>
              </div>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="BOS-TAL-18V"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs uppercase font-mono text-slate-900 focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Código de Barras
              </label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="779..."
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Unidad de Medida
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-900 focus:border-slate-900 focus:outline-hidden"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Precios y Stock */}
          <div className="grid grid-cols-4 gap-3 border-t border-slate-100 pt-3">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Costo Unit. (ARS)
              </label>
              <input
                type="number"
                min="0"
                value={cost || ""}
                onChange={(e) => setCost(Number(e.target.value))}
                placeholder="0"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                PVP Venta (ARS) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={price || ""}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Stock Inicial
              </label>
              <input
                type="number"
                min="0"
                value={stock || ""}
                onChange={(e) => setStock(Number(e.target.value))}
                placeholder="0"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Stock Mínimo
              </label>
              <input
                type="number"
                min="1"
                value={minimumStock}
                onChange={(e) => setMinimumStock(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Ubicación Física */}
          <div className="border-t border-slate-100 pt-3">
            <span className="block text-xs font-medium text-slate-700 mb-2">
              Ubicación Física en Almacén
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500">Pasillo</label>
                <select
                  value={aisle}
                  onChange={(e) => setAisle(e.target.value)}
                  className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
                >
                  <option value="A1">A1 (Herramientas eléctricas)</option>
                  <option value="A2">A2 (Herramientas manuales)</option>
                  <option value="A3">A3 (Fijaciones y tornillos)</option>
                  <option value="A4">A4 (Plomería)</option>
                  <option value="A5">A5 (Electricidad)</option>
                  <option value="A6">A6 (Pinturas)</option>
                  <option value="A7">A7 (Construcción)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500">Rack</label>
                <input
                  type="text"
                  value={rack}
                  onChange={(e) => setRack(e.target.value)}
                  placeholder="R1"
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs uppercase text-slate-900 focus:border-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500">Estante</label>
                <input
                  type="text"
                  value={shelf}
                  onChange={(e) => setShelf(e.target.value)}
                  placeholder="S1"
                  className="mt-0.5 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs uppercase text-slate-900 focus:border-slate-900 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Descripción o Especificación Técnica
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles sobre características, medidas o uso recomendado..."
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
