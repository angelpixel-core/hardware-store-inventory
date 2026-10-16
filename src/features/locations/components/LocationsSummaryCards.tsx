import { Grid, Layers, Map, Package } from "lucide-react";
import type { LocationsKPIs } from "../types";

export interface LocationsSummaryCardsProps {
  kpis: LocationsKPIs;
}

export function LocationsSummaryCards({ kpis }: LocationsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Pasillos */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Pasillos Físicos</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Map size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalAisles}{" "}
            <span className="text-sm font-normal text-slate-500">sectores</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Tienda Principal • Zonificación A1 - A7
          </div>
        </div>
      </div>

      {/* 2. Racks */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Racks y Góndolas</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Layers size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalRacks}{" "}
            <span className="text-sm font-normal text-slate-500">módulos</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Estructuras metálicas de almacenamiento
          </div>
        </div>
      </div>

      {/* 3. Estantes / Gavetas */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Estantes y Gavetas</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Grid size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalShelves}{" "}
            <span className="text-sm font-normal text-slate-500">posiciones</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Niveles de altura y gaveteros asignados
          </div>
        </div>
      </div>

      {/* 4. Unidades Custodiadas */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">Capacidad en Mano</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Package size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900">
            {kpis.totalUnitsStored.toLocaleString("es-AR")}{" "}
            <span className="text-sm font-normal text-slate-500">un.</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {kpis.assignedProducts} SKUs geolocalizados en el local
          </div>
        </div>
      </div>
    </div>
  );
}
