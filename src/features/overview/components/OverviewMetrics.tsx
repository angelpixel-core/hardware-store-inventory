import {
  AlertTriangle,
  CircleDollarSign,
  Layers,
  Package,
} from "lucide-react";
import { formatCurrency } from "../../../utils/formatters";
import type { OverviewKPIs } from "../types";

export interface OverviewMetricsProps {
  kpis: OverviewKPIs;
  onNavigateSection?: (section: "products" | "inventory" | "alerts") => void;
}

export function OverviewMetrics({ kpis, onNavigateSection }: OverviewMetricsProps) {
  const hasCriticalStock = kpis.outOfStockCount > 0 || kpis.lowStockCount > 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Valuación de Stock */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Valuación en Costo</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CircleDollarSign size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {formatCurrency(kpis.totalInventoryCost)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>PVP est.:</span>
            <span className="font-medium text-slate-700">
              {formatCurrency(kpis.totalInventoryValue)}
            </span>
            <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-800">
              +{kpis.projectedMarginPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Unidades Físicas */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Unidades en Mano</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Package size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalUnits.toLocaleString("es-AR")}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Artículos físicos disponibles en depósito y tienda
          </div>
        </div>
      </div>

      {/* 3. Catálogo / SKUs */}
      <div
        onClick={() => onNavigateSection?.("products")}
        className="flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Catálogo Activo</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Layers size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalSkus} <span className="text-sm font-normal text-slate-500">SKUs</span>
          </div>
          <div className="mt-1 text-xs font-medium text-indigo-600">
            Ver catálogo completo →
          </div>
        </div>
      </div>

      {/* 4. Stock Crítico / Alertas */}
      <div
        onClick={() => onNavigateSection?.("alerts")}
        className={`flex cursor-pointer flex-col justify-between rounded-xl border p-5 shadow-xs transition hover:shadow-sm ${
          hasCriticalStock
            ? "border-amber-200 bg-amber-50/40 hover:border-amber-300"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Atención de Stock</span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              hasCriticalStock
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <AlertTriangle size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold tracking-tight ${
                hasCriticalStock ? "text-amber-900" : "text-slate-900"
              }`}
            >
              {kpis.outOfStockCount + kpis.lowStockCount}
            </span>
            <span className="text-xs text-slate-500">artículos</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            {kpis.outOfStockCount > 0 && (
              <span className="font-semibold text-rose-600">
                {kpis.outOfStockCount} agotados
              </span>
            )}
            {kpis.lowStockCount > 0 && (
              <span className="text-amber-700">
                {kpis.lowStockCount} bajo mínimo
              </span>
            )}
            {!hasCriticalStock && (
              <span className="text-emerald-600 font-medium">Niveles óptimos</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
