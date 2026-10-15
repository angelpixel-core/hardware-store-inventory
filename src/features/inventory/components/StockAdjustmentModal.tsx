import { AlertTriangle, Minus, Plus, Scale, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { AdjustStockInput } from "../../../hooks/useInventoryState";
import type { Product } from "../../../types/inventory";

export interface StockAdjustmentModalProps {
  isOpen: boolean;
  products: Product[];
  initialProductId?: string;
  onClose: () => void;
  onSubmit: (input: AdjustStockInput) => void;
}

const ADJUSTMENT_MOTIVES = [
  {
    id: "rotura",
    label: "Rotura o daño de mercadería",
    defaultSign: -1,
    description: "Producto golpeado, quebrado o inutilizable en depósito/salón",
  },
  {
    id: "merma",
    label: "Merma por fraccionamiento",
    defaultSign: -1,
    description: "Pérdida por corte de cables, mangueras, cabos o evaporación",
  },
  {
    id: "vencimiento",
    label: "Vencimiento / Deterioro químico",
    defaultSign: -1,
    description: "Pinturas, selladores o adhesivos fuera de vida útil",
  },
  {
    id: "recuento_faltante",
    label: "Recuento físico: Faltante de stock",
    defaultSign: -1,
    description: "Diferencia negativa detectada durante inventario rotativo",
  },
  {
    id: "recuento_sobrante",
    label: "Recuento físico: Sobrante de stock",
    defaultSign: 1,
    description: "Unidades adicionales halladas en góndola o depósito",
  },
  {
    id: "garantia_devolucion",
    label: "Reingreso por garantía o devolución",
    defaultSign: 1,
    description: "Reincorporación de mercadería apta al stock comercial",
  },
  {
    id: "otro",
    label: "Otro ajuste de auditoría",
    defaultSign: -1,
    description: "Ajuste manual extraordinario con justificación requerida",
  },
];

export function StockAdjustmentModal({
  isOpen,
  products,
  initialProductId,
  onClose,
  onSubmit,
}: StockAdjustmentModalProps) {
  const [productId, setProductId] = useState<string>(
    initialProductId || (products[0]?.id ?? ""),
  );
  const [selectedMotiveId, setSelectedMotiveId] = useState<string>(
    ADJUSTMENT_MOTIVES[0].id,
  );
  const [direction, setDirection] = useState<"decrease" | "increase">("decrease");
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId],
  );

  const filteredProducts = useMemo(() => {
    if (!searchFilter.trim()) return products;
    const term = searchFilter.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    );
  }, [products, searchFilter]);

  if (!isOpen) return null;

  function handleMotiveChange(motiveId: string) {
    setSelectedMotiveId(motiveId);
    const m = ADJUSTMENT_MOTIVES.find((item) => item.id === motiveId);
    if (m) {
      setDirection(m.defaultSign === 1 ? "increase" : "decrease");
    }
  }

  const effectiveDelta = direction === "increase" ? quantity : -quantity;
  const currentStock = selectedProduct?.stock ?? 0;
  const projectedStock = currentStock + effectiveDelta;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0) return;

    const motiveObj = ADJUSTMENT_MOTIVES.find((m) => m.id === selectedMotiveId);
    const motiveText = motiveObj ? motiveObj.label : "Ajuste manual";
    const finalReason = note.trim()
      ? `[${motiveText}] ${note.trim()}`
      : `[${motiveText}]`;

    onSubmit({
      productId: selectedProduct.id,
      delta: effectiveDelta,
      reason: finalReason,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white">
              <Scale size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Ajuste Contable y Físico de Stock (Kardex)
              </h2>
              <p className="text-[11px] text-slate-500">
                Auditoría de mermas, roturas, diferencias de recuento y bajas
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
          {/* Selector de Producto */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700">
                Producto Afectado *
              </label>
              <span className="text-[11px] text-slate-400">
                {products.length} productos registrados
              </span>
            </div>

            <div className="mt-1 space-y-2">
              <input
                type="text"
                placeholder="Filtrar por nombre, SKU o categoría..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:outline-hidden"
              />

              <select
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-slate-900 focus:outline-hidden"
              >
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.sku}] {p.name} — Stock actual: {p.stock} {p.unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motivo de Ajuste */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Motivo de la Auditoría / Causa *
            </label>
            <div className="mt-1 grid grid-cols-1 gap-1.5">
              {ADJUSTMENT_MOTIVES.map((m) => (
                <label
                  key={m.id}
                  onClick={() => handleMotiveChange(m.id)}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-xs transition ${
                    selectedMotiveId === m.id
                      ? "border-amber-500 bg-amber-50/50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="motive"
                    checked={selectedMotiveId === m.id}
                    onChange={() => handleMotiveChange(m.id)}
                    className="mt-0.5 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{m.label}</span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          m.defaultSign === 1
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {m.defaultSign === 1 ? "+ Ingreso" : "- Salida / Merma"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">{m.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Dirección y Cantidad */}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Efecto en el Stock
              </label>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDirection("decrease")}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-lg border py-2 text-xs font-medium transition ${
                    direction === "decrease"
                      ? "border-rose-500 bg-rose-50 text-rose-700 font-semibold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Minus size={14} /> Disminuir / Merma
                </button>
                <button
                  type="button"
                  onClick={() => setDirection("increase")}
                  className={`flex flex-1 items-center justify-center gap-1 rounded-lg border py-2 text-xs font-medium transition ${
                    direction === "increase"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Plus size={14} /> Aumentar / Sobrante
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Cantidad a Ajustar ({selectedProduct?.unit ?? "un"}) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantity || ""}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden font-semibold"
              />
            </div>
          </div>

          {/* Balance Preview Card */}
          {selectedProduct && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/75 p-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Stock Actual:</span>
                <span className="font-semibold text-slate-900">
                  {currentStock} {selectedProduct.unit}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-slate-600">
                <span>Variación por Ajuste:</span>
                <span
                  className={`font-semibold ${
                    effectiveDelta > 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {effectiveDelta > 0 ? `+${effectiveDelta}` : effectiveDelta}{" "}
                  {selectedProduct.unit}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-2 font-medium">
                <span className="text-slate-900">Nuevo Balance en Kardex:</span>
                <span
                  className={`text-sm font-bold ${
                    projectedStock < 0
                      ? "text-rose-600"
                      : projectedStock <= selectedProduct.minimumStock
                      ? "text-amber-600"
                      : "text-slate-900"
                  }`}
                >
                  {projectedStock} {selectedProduct.unit}
                </span>
              </div>
              {projectedStock < 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-rose-600">
                  <AlertTriangle size={13} />
                  <span>Atención: El ajuste resultará en un balance negativo.</span>
                </div>
              )}
            </div>
          )}

          {/* Nota de Auditoría */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              Justificación de Auditoría / Observación detallada
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Detectada rotura en bulto al descargar el pallet de fábrica..."
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
              className="rounded-lg bg-amber-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700"
            >
              Confirmar Ajuste en Kardex
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
