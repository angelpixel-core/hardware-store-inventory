import { AlertTriangle, Minus, Plus, Scale, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "../../../i18n";
import type { AdjustStockInput } from "../../../hooks/useInventoryState";
import type { Product } from "../../../types/inventory";

export interface StockAdjustmentModalProps {
  isOpen: boolean;
  products: Product[];
  initialProductId?: string;
  onClose: () => void;
  onSubmit: (input: AdjustStockInput) => void;
}

export function StockAdjustmentModal({
  isOpen,
  products,
  initialProductId,
  onClose,
  onSubmit,
}: StockAdjustmentModalProps) {
  const { t } = useTranslation();
  const [productId, setProductId] = useState<string>(
    initialProductId || (products[0]?.id ?? ""),
  );

  const motives = useMemo(() => [
    {
      id: "DAMAGE",
      label: t.stockAdjustment.reasons.DAMAGE,
      defaultSign: -1,
      description: "Producto golpeado, quebrado o inutilizable en depósito/salón",
    },
    {
      id: "SHRINKAGE",
      label: t.stockAdjustment.reasons.SHRINKAGE,
      defaultSign: -1,
      description: "Pérdida por corte de cables, mangueras, cabos o evaporación",
    },
    {
      id: "PHYSICAL_AUDIT",
      label: t.stockAdjustment.reasons.PHYSICAL_AUDIT,
      defaultSign: -1,
      description: "Diferencia detectada durante recuento o inventario rotativo",
    },
    {
      id: "OTHER",
      label: t.stockAdjustment.reasons.OTHER,
      defaultSign: -1,
      description: "Ajuste manual extraordinario con justificación requerida",
    },
  ], [t]);

  const [selectedMotiveId, setSelectedMotiveId] = useState<string>("DAMAGE");
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
    const m = motives.find((item) => item.id === motiveId);
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

    const motiveObj = motives.find((m) => m.id === selectedMotiveId);
    const motiveText = motiveObj ? motiveObj.label : "Manual Adjustment";
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white">
              <Scale size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {t.stockAdjustment.title}
              </h2>
              <p className="text-[11px] text-slate-500">
                {t.stockAdjustment.subtitle}
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
            <label className="block text-xs font-medium text-slate-700">
              {t.stockAdjustment.selectProduct}
            </label>
            <div className="mt-1 space-y-1.5">
              <input
                type="text"
                placeholder={t.catalog.searchPlaceholder}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-slate-900 focus:outline-hidden"
              />
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-slate-900 focus:outline-hidden"
              >
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} — {p.name} ({p.stock} {p.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motivo de Ajuste */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              {t.stockAdjustment.reasons.title}
            </label>
            <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {motives.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => handleMotiveChange(m.id)}
                  className={`flex flex-col text-left rounded-xl border p-2.5 transition ${
                    selectedMotiveId === m.id
                      ? "border-amber-500 bg-amber-50/60 ring-1 ring-amber-500"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-900">{m.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{m.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dirección y Magnitud */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
              {t.stockAdjustment.variation}
            </span>

            <div className="flex items-center gap-3">
              {/* Toggle Disminución / Aumento */}
              <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setDirection("decrease")}
                  className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    direction === "decrease"
                      ? "bg-rose-500 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Minus size={13} /> {t.overview.charts.outbound}
                </button>
                <button
                  type="button"
                  onClick={() => setDirection("increase")}
                  className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    direction === "increase"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Plus size={13} /> {t.overview.charts.inbound}
                </button>
              </div>

              {/* Cantidad Input */}
              <div className="flex-1">
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity || ""}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 0))}
                  placeholder="1"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-900 focus:border-slate-900 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Balance Preview */}
          {selectedProduct && (
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>{t.stockAdjustment.currentStock}</span>
                <span className="font-semibold text-slate-700">
                  {currentStock} {selectedProduct.unit}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>{t.stockAdjustment.variation}</span>
                <span
                  className={`font-semibold ${
                    effectiveDelta > 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {effectiveDelta > 0 ? `+${effectiveDelta}` : effectiveDelta}{" "}
                  {selectedProduct.unit}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-1.5 flex justify-between font-medium">
                <span className="text-slate-900">{t.stockAdjustment.newStock}:</span>
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
                  <span>Atención: El balance resultará en existencia negativa.</span>
                </div>
              )}
            </div>
          )}

          {/* Nota de Auditoría */}
          <div>
            <label className="block text-xs font-medium text-slate-700">
              {t.common.notes}
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.stockAdjustment.notesPlaceholder}
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
              {t.stockAdjustment.cancelBtn}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-amber-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700"
            >
              {t.stockAdjustment.submitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
