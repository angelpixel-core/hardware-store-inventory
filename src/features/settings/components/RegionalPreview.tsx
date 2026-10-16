import { Calendar, DollarSign } from "lucide-react";
import { useTranslation } from "../../../i18n";

export function RegionalPreview() {
  const { t, formatCurrency, formatDate } = useTranslation();

  const now = new Date();
  const sampleAmount = 14580.75;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <DollarSign size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            {t.settings.regional.title}
          </h2>
          <p className="text-xs text-slate-500">
            {t.settings.regional.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Currency preview */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <DollarSign size={14} className="text-slate-400" />
            {t.settings.regional.currencyFormat}
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900">
            {formatCurrency(sampleAmount)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            PVP de muestra para cálculo de márgenes y órdenes de compra
          </p>
        </div>

        {/* Date preview */}
        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Calendar size={14} className="text-slate-400" />
            {t.settings.regional.dateFormat}
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900">
            {formatDate(now)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Estampa cronológica para auditoría en el libro mayor de Kardex
          </p>
        </div>
      </div>
    </div>
  );
}
