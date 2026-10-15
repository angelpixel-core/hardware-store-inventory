import { ChevronRight, Layers, MapPin } from "lucide-react";
import type { AisleInfo, RackInfo } from "../types";

export interface StoreLayoutMapProps {
  aisles: AisleInfo[];
  selectedAisleId: string;
  onSelectAisle: (id: string) => void;
  activeRacks: RackInfo[];
  selectedRackId: string | null;
  onSelectRack: (rackId: string | null) => void;
}

export function StoreLayoutMap({
  aisles,
  selectedAisleId,
  onSelectAisle,
  activeRacks,
  selectedRackId,
  onSelectRack,
}: StoreLayoutMapProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Plano de Distribución Física (Pasillos A1 - A7)
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Haz clic en un pasillo o rack para inspeccionar los artículos almacenados
          </p>
        </div>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          7 pasillos en Tienda
        </span>
      </div>

      {/* Grid de Pasillos */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {aisles.map((aisle) => {
          const isSelected = aisle.id === selectedAisleId;
          const hasProducts = aisle.productCount > 0;

          return (
            <div
              key={aisle.id}
              onClick={() => onSelectAisle(aisle.id)}
              className={`flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 transition ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-600"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected ? "text-indigo-700" : "text-slate-900"
                    }`}
                  >
                    {aisle.id}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      hasProducts ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                </div>

                <div className="mt-2 text-xs font-semibold text-slate-900 line-clamp-1">
                  {aisle.category}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500 line-clamp-2 leading-snug">
                  {aisle.description}
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-2 flex items-center justify-between text-[11px]">
                <span className="font-medium text-slate-700">
                  {aisle.productCount} SKUs
                </span>
                <span className="text-slate-500">{aisle.totalUnits} un.</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub-selector de Racks del Pasillo Activo */}
      {activeRacks.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-slate-500 mr-1">
            <Layers size={14} /> Módulos / Racks en {selectedAisleId}:
          </span>

          <button
            onClick={() => onSelectRack(null)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              selectedRackId === null
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos los racks
          </button>

          {activeRacks.map((rack) => {
            const isRackSelected = selectedRackId === rack.id;
            return (
              <button
                key={rack.id}
                onClick={() => onSelectRack(isRackSelected ? null : rack.id)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  isRackSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{rack.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isRackSelected
                      ? "bg-indigo-700 text-white"
                      : "bg-white text-slate-600"
                  }`}
                >
                  {rack.productCount}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
