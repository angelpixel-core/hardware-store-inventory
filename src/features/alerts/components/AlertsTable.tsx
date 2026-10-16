import {
  AlertOctagon,
  AlertTriangle,
  ExternalLink,
  MapPin,
  PackageCheck,
  Plus,
} from "lucide-react";
import { useTranslation } from "../../../i18n";
import { formatCurrency } from "../../../utils/formatters";
import type { InventoryAlert } from "../types";

export interface AlertsTableProps {
  alerts: InventoryAlert[];
  selectedAlertIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectProduct: (id: string) => void;
  onReceive: (productId: string) => void;
}

export function AlertsTable({
  alerts,
  selectedAlertIds,
  onToggleSelect,
  onSelectProduct,
  onReceive,
}: AlertsTableProps) {
  const { t } = useTranslation();

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-xs">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <PackageCheck size={24} />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">
          {t.alerts.table.emptyTitle}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {t.alerts.table.emptySubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-600">
            <tr>
              <th className="w-10 px-4 py-3 text-center">
                <span className="sr-only">{t.catalog.table.actions}</span>
              </th>
              <th className="px-4 py-3">{t.alerts.table.severity}</th>
              <th className="px-4 py-3">{t.alerts.table.product}</th>
              <th className="px-4 py-3">{t.alerts.table.location}</th>
              <th className="px-4 py-3 text-right">{t.alerts.table.currentStock}</th>
              <th className="px-4 py-3 text-right">{t.alerts.table.suggestedOrder}</th>
              <th className="px-4 py-3 text-right">{t.alerts.table.estimatedCost}</th>
              <th className="px-4 py-3 text-center">{t.alerts.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {alerts.map((alert) => {
              const isSelected = selectedAlertIds.has(alert.id);
              const isOverstock = alert.severity === "OVERSTOCK";

              return (
                <tr
                  key={alert.id}
                  className={`transition hover:bg-slate-50/80 ${
                    isSelected ? "bg-emerald-50/30" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3 text-center">
                    {!isOverstock && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(alert.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    )}
                  </td>

                  {/* Severidad */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {alert.severity === "CRITICAL" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">
                        <AlertOctagon size={11} /> {t.alerts.table.criticalBadge}
                      </span>
                    )}
                    {alert.severity === "WARNING" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-inset ring-amber-200">
                        <AlertTriangle size={11} /> {t.alerts.table.warningBadge}
                      </span>
                    )}
                    {alert.severity === "OVERSTOCK" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
                        <PackageCheck size={11} /> {t.alerts.table.overstockBadge}
                      </span>
                    )}
                  </td>

                  {/* Producto */}
                  <td className="px-4 py-3">
                    <div
                      onClick={() => onSelectProduct(alert.productId)}
                      className="cursor-pointer space-y-0.5 group"
                    >
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                        {alert.product.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-mono text-slate-600">
                          {alert.product.sku}
                        </span>
                        <span>•</span>
                        <span>{alert.product.brand}</span>
                        <span>•</span>
                        <span className="text-slate-500">
                          {alert.product.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Ubicación */}
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <MapPin size={11} className="text-slate-400" />
                      {alert.locationLabel}
                    </span>
                  </td>

                  {/* Existencias */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {alert.currentStock}{" "}
                      <span className="text-[11px] font-normal text-slate-400">
                        / {alert.minimumStock} min
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {alert.product.unit}
                    </div>
                  </td>

                  {/* Déficit / Sugerido */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {!isOverstock ? (
                      <div>
                        <span className="font-semibold text-rose-600">
                          +{alert.suggestedReorderQuantity}
                        </span>{" "}
                        <span className="text-[11px] text-slate-500">
                          {alert.product.unit}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {t.alerts.table.targetMeta} {alert.targetStock} un
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Costo Estimado */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {!isOverstock ? (
                      <div>
                        <div className="font-semibold text-slate-900">
                          {formatCurrency(alert.estimatedCost)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatCurrency(alert.unitCost)} {t.alerts.table.eachCost}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">
                        {t.alerts.table.immobilized}
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onReceive(alert.productId)}
                        className="flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-slate-800"
                        title={t.alerts.table.receiveBtn}
                      >
                        <Plus size={12} /> {t.alerts.table.receiveBtn}
                      </button>
                      <button
                        onClick={() => onSelectProduct(alert.productId)}
                        className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
                        title="Ver detalle"
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
