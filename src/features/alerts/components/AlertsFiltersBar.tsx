import { FileSpreadsheet, Filter, Search, X } from "lucide-react";
import type { AlertFilterSeverity, AlertsKPIs } from "../types";

export interface AlertsFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedSeverity: AlertFilterSeverity;
  onSeverityChange: (severity: AlertFilterSeverity) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  kpis: AlertsKPIs;
  selectedCount: number;
  onOpenOrderModal: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export function AlertsFiltersBar({
  search,
  onSearchChange,
  selectedSeverity,
  onSeverityChange,
  selectedCategory,
  onCategoryChange,
  categories,
  kpis,
  selectedCount,
  onOpenOrderModal,
  onSelectAll,
  onClearSelection,
}: AlertsFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      {/* Upper row: Search, Category, and Action Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre, SKU, marca o categoría..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white focus:outline-hidden"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter size={14} />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button: Purchase Order Assistant */}
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <button
              onClick={onClearSelection}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Limpiar ({selectedCount})
            </button>
          )}

          <button
            onClick={onOpenOrderModal}
            className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-800"
          >
            <FileSpreadsheet size={15} />
            Generar Orden de Compra {selectedCount > 0 ? `(${selectedCount})` : "General"}
          </button>
        </div>
      </div>

      {/* Lower row: Severity Filter Pills & Batch Selection Shortcut */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Todas */}
          <button
            onClick={() => onSeverityChange("ALL")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedSeverity === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todas ({kpis.totalAlerts})
          </button>

          {/* Críticas */}
          <button
            onClick={() => onSeverityChange("CRITICAL")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedSeverity === "CRITICAL"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Quiebres ({kpis.criticalCount})
          </button>

          {/* Advertencias */}
          <button
            onClick={() => onSeverityChange("WARNING")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedSeverity === "WARNING"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Bajo Stock ({kpis.warningCount})
          </button>

          {/* Sobrestock */}
          <button
            onClick={() => onSeverityChange("OVERSTOCK")}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
              selectedSeverity === "OVERSTOCK"
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-800 hover:bg-blue-100"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Sobrestock ({kpis.overstockCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onSelectAll}
            className="text-slate-600 underline hover:text-slate-900"
          >
            Seleccionar todos para reorden
          </button>
        </div>
      </div>
    </div>
  );
}
