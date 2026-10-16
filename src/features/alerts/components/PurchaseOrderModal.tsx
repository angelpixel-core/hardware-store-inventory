import { Check, Copy, Download, FileSpreadsheet, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../../../i18n";
import { formatCurrency } from "../../../utils/formatters";
import type { PurchaseOrderDraft } from "../types";

export interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: PurchaseOrderDraft;
  onExportCsv: () => void;
  onCopyText: () => boolean;
}

export function PurchaseOrderModal({
  isOpen,
  onClose,
  draft,
  onExportCsv,
  onCopyText,
}: PurchaseOrderModalProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  function handleCopy() {
    const success = onCopyText();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {t.purchaseOrder.title}
              </h2>
              <p className="text-xs text-slate-500">
                {t.purchaseOrder.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resumen KPI del Pedido */}
        <div className="grid grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50/50 px-6 py-3.5">
          <div>
            <span className="text-[11px] font-medium text-slate-500">
              {t.purchaseOrder.itemsCount}
            </span>
            <div className="text-lg font-bold text-slate-900">
              {draft.totalItems}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500">
              {t.purchaseOrder.totalUnits}
            </span>
            <div className="text-lg font-bold text-slate-900">
              {draft.totalUnits} un.
            </div>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500">
              {t.purchaseOrder.totalInvestment}
            </span>
            <div className="text-lg font-bold text-emerald-700">
              {formatCurrency(draft.totalEstimatedCost)}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {draft.items.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              {t.purchaseOrder.emptyDraft}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-[11px] font-semibold text-slate-500">
                <tr>
                  <th className="pb-2">{t.purchaseOrder.sku}</th>
                  <th className="pb-2">{t.purchaseOrder.product}</th>
                  <th className="pb-2">{t.purchaseOrder.brand}</th>
                  <th className="pb-2 text-right">{t.purchaseOrder.quantity}</th>
                  <th className="pb-2 text-right">{t.purchaseOrder.unitCost}</th>
                  <th className="pb-2 text-right">{t.purchaseOrder.estimatedTotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {draft.items.map((it) => (
                  <tr key={it.productId} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-mono text-slate-500">{it.sku}</td>
                    <td className="py-2.5 font-medium text-slate-900">
                      {it.name}
                    </td>
                    <td className="py-2.5 text-slate-500">{it.brand}</td>
                    <td className="py-2.5 text-right font-semibold text-slate-900">
                      {it.quantityToOrder} {it.unit}
                    </td>
                    <td className="py-2.5 text-right text-slate-600">
                      {formatCurrency(it.unitCost)}
                    </td>
                    <td className="py-2.5 text-right font-medium text-slate-900">
                      {formatCurrency(it.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <span className="text-[11px] text-slate-500">
            {t.purchaseOrder.disclaimer}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={draft.items.length === 0}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" /> {t.purchaseOrder.copiedSuccess}
                </>
              ) : (
                <>
                  <Copy size={14} /> {t.purchaseOrder.copyClipboardBtn}
                </>
              )}
            </button>

            <button
              onClick={onExportCsv}
              disabled={draft.items.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-800 disabled:opacity-50"
            >
              <Download size={14} /> {t.purchaseOrder.downloadCsvBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
