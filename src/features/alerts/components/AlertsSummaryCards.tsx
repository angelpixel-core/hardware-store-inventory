import {
  AlertOctagon,
  AlertTriangle,
  CircleDollarSign,
  PackageCheck,
} from "lucide-react";
import { useTranslation } from "../../../i18n";
import { formatCurrency } from "../../../utils/formatters";
import type { AlertsKPIs } from "../types";

export interface AlertsSummaryCardsProps {
  kpis: AlertsKPIs;
  onFilterSeverity?: (severity: "CRITICAL" | "WARNING" | "OVERSTOCK" | "ALL") => void;
}

export function AlertsSummaryCards({
  kpis,
  onFilterSeverity,
}: AlertsSummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Quiebres de Stock (Crítico) */}
      <div
        onClick={() => onFilterSeverity?.("CRITICAL")}
        className="flex cursor-pointer flex-col justify-between rounded-xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs transition hover:border-rose-300 hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-700">
            {t.alerts.kpis.critical}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <AlertOctagon size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-rose-950">
            {kpis.criticalCount}{" "}
            <span className="text-sm font-normal text-rose-600">
              {t.alerts.kpis.itemsUnit}
            </span>
          </div>
          <div className="mt-1 text-xs text-rose-600">
            {t.alerts.kpis.criticalSub}
          </div>
        </div>
      </div>

      {/* 2. Bajo Stock (Advertencia) */}
      <div
        onClick={() => onFilterSeverity?.("WARNING")}
        className="flex cursor-pointer flex-col justify-between rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs transition hover:border-amber-300 hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-700">
            {t.alerts.kpis.warning}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-amber-950">
            {kpis.warningCount}{" "}
            <span className="text-sm font-normal text-amber-600">
              {t.alerts.kpis.itemsUnit}
            </span>
          </div>
          <div className="mt-1 text-xs text-amber-600">
            {t.alerts.kpis.warningSub}
          </div>
        </div>
      </div>

      {/* 3. Sobrestock */}
      <div
        onClick={() => onFilterSeverity?.("OVERSTOCK")}
        className="flex cursor-pointer flex-col justify-between rounded-xl border border-blue-200 bg-blue-50/30 p-5 shadow-xs transition hover:border-blue-300 hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-700">
            {t.alerts.kpis.overstock}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <PackageCheck size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-blue-950">
            {kpis.overstockCount}{" "}
            <span className="text-sm font-normal text-blue-600">
              {t.alerts.kpis.itemsUnit}
            </span>
          </div>
          <div className="mt-1 text-xs text-blue-600">
            {t.alerts.kpis.overstockSub}
          </div>
        </div>
      </div>

      {/* 4. Costo Estimado de Saneamiento */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {t.alerts.kpis.restockInvestment}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CircleDollarSign size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(kpis.totalReplenishmentCost)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {t.alerts.kpis.restockInvestmentSub}
          </div>
        </div>
      </div>
    </div>
  );
}
