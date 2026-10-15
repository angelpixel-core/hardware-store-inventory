import { formatCurrency } from "../../../utils/formatters";
import type { CategoryDistribution } from "../types";

export interface CategoryBreakdownProps {
  categories: CategoryDistribution[];
}

const CATEGORY_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
];

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Distribución por Rubro Comercial
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Volumen físico y valuación monetaria por categoría
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {categories.length} rubros
        </span>
      </div>

      {/* Barra cromática continua superior */}
      <div className="mb-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        {categories.map((cat, idx) => (
          <div
            key={cat.category}
            style={{ width: `${cat.percentOfUnits}%` }}
            className={`h-full ${
              CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
            } transition-all duration-300`}
            title={`${cat.category}: ${cat.percentOfUnits}%`}
          />
        ))}
      </div>

      {/* Lista detallada de categorías */}
      <div className="space-y-3">
        {categories.map((cat, idx) => {
          const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
          return (
            <div key={cat.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${colorClass}`} />
                  <span className="font-medium text-slate-800">{cat.category}</span>
                  <span className="text-slate-400">({cat.productCount} SKUs)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">{cat.totalUnits} un.</span>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(cat.totalCost)}
                  </span>
                  <span className="w-10 text-right font-medium text-slate-500">
                    {cat.percentOfUnits}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full ${colorClass} rounded-full`}
                  style={{ width: `${cat.percentOfUnits}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
