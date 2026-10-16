import { Download, Search } from "lucide-react";
import { useTranslation } from "../../../i18n";
import type { StockMovementType } from "../../../types/inventory";

export type KardexFilterType = "ALL" | StockMovementType;

export interface KardexFiltersBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  selectedType: KardexFilterType;
  onTypeChange: (type: KardexFilterType) => void;
  onExportCsv: () => void;
  totalFilteredCount: number;
}

export function KardexFiltersBar({
  search,
  onSearchChange,
  selectedType,
  onTypeChange,
  onExportCsv,
  totalFilteredCount,
}: KardexFiltersBarProps) {
  const { t } = useTranslation();

  const typeOptions: { id: KardexFilterType; label: string }[] = [
    { id: "ALL", label: t.inventory.filters.allTypes },
    { id: "PURCHASE", label: t.movementTypes.PURCHASE },
    { id: "SALE", label: t.movementTypes.SALE },
    { id: "ADJUSTMENT", label: t.movementTypes.ADJUSTMENT },
    { id: "RETURN", label: t.movementTypes.RETURN },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.inventory.filters.searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden"
        />
      </div>

      {/* Type Filter Pills & Export Button */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {typeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onTypeChange(opt.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                selectedType === opt.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={onExportCsv}
          disabled={totalFilteredCount === 0}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          title={t.inventory.filters.exportCsvBtn}
        >
          <Download size={13} />
          <span>{t.inventory.filters.exportCsvBtn} ({totalFilteredCount})</span>
        </button>
      </div>
    </div>
  );
}
