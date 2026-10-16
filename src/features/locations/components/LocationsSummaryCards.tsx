import { Grid, Layers, Map, Package } from "lucide-react";
import { useTranslation } from "../../../i18n";
import type { LocationsKPIs } from "../types";

export interface LocationsSummaryCardsProps {
  kpis: LocationsKPIs;
}

export function LocationsSummaryCards({ kpis }: LocationsSummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Pasillos */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {t.locations.kpis.totalAisles}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Map size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalAisles}{" "}
            <span className="text-sm font-normal text-slate-500">A1 - A7</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {t.locations.layoutTitle}
          </div>
        </div>
      </div>

      {/* 2. Racks */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {t.locations.kpis.totalRacks}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Layers size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalRacks}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {t.createProduct.fields.shelf}
          </div>
        </div>
      </div>

      {/* 3. Estantes / Gavetas */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {t.createProduct.fields.level}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Grid size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalShelves}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {t.common.location}
          </div>
        </div>
      </div>

      {/* 4. Unidades Custodiadas */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {t.locations.kpis.assignedProducts}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Package size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalUnitsStored.toLocaleString()}{" "}
            <span className="text-sm font-normal text-slate-500">{t.common.units}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {kpis.assignedProducts} SKUs
          </div>
        </div>
      </div>
    </div>
  );
}
