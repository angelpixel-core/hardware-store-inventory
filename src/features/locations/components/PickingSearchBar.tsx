import { Compass, MapPin, Search, X } from "lucide-react";
import type { PickingMatch } from "../types";

export interface PickingSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  matches: PickingMatch[];
  onSelectMatch: (match: PickingMatch) => void;
}

export function PickingSearchBar({
  query,
  onQueryChange,
  matches,
  onSelectMatch,
}: PickingSearchBarProps) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <Compass size={16} className="text-indigo-600" />
        <span className="text-xs font-semibold text-slate-900">
          Localizador de Mostrador (Modo Picking)
        </span>
        <span className="text-[11px] text-slate-500">
          • Encuentra al instante la ubicación exacta de cualquier artículo
        </span>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Escribe el nombre, código de barras o SKU para localizar en el mapa..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-9 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Floating Picking Results */}
      {matches.length > 0 && (
        <div className="absolute left-4 right-4 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400">
            Coincidencias encontradas ({matches.length})
          </div>
          <div className="divide-y divide-slate-100">
            {matches.map((m) => (
              <div
                key={m.product.id}
                onClick={() => onSelectMatch(m)}
                className="flex cursor-pointer items-center justify-between p-2.5 rounded-lg transition hover:bg-indigo-50/50"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      {m.product.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {m.product.sku}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {m.product.brand} • {m.product.category}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      m.inStock
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {m.inStock ? `${m.product.stock} un.` : "Sin stock"}
                  </span>

                  <span className="flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                    <MapPin size={12} /> {m.locationLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
