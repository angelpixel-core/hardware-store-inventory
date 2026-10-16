import { CheckCircle2, MapPin, Plus } from "lucide-react";
import { useTranslation } from "../../../i18n";
import type { CriticalProduct } from "../types";

export interface UrgentReorderListProps {
  products: CriticalProduct[];
  onSelectProduct: (id: string) => void;
  onReceive: (productId: string) => void;
  onViewAllAlerts?: () => void;
}

export function UrgentReorderList({
  products,
  onSelectProduct,
  onReceive,
  onViewAllAlerts,
}: UrgentReorderListProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            {t.overview.urgent.title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {t.overview.urgent.subtitle}
          </p>
        </div>
        {onViewAllAlerts && (
          <button
            onClick={onViewAllAlerts}
            className="text-xs font-medium text-slate-600 transition hover:text-slate-900"
          >
            {t.nav.alerts} →
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
          <span className="text-sm font-medium text-slate-800">
            {t.stockStatus.normal}
          </span>
          <span className="mt-1 text-xs text-slate-400">
            {t.overview.urgent.noUrgent}
          </span>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {products.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between py-3 transition"
            >
              <div
                onClick={() => onSelectProduct(item.id)}
                className="cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 transition group-hover:text-blue-600">
                    {item.name}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600">
                    {item.sku}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="text-[11px] font-medium text-slate-600">
                    {item.brand}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin size={11} /> {item.locationLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      item.status === "OUT_OF_STOCK"
                        ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                        : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                    }`}
                  >
                    {item.status === "OUT_OF_STOCK"
                      ? `${t.stockStatus.outOfStock} (0 ${t.common.units})`
                      : `${item.stock} / ${item.minimumStock} min`}
                  </span>
                  <div className="mt-0.5 text-[10px] text-slate-400">
                    Déficit: -{item.deficit} {t.common.units}
                  </div>
                </div>

                <button
                  onClick={() => onReceive(item.id)}
                  className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                  title={t.overview.urgent.receiveBtn}
                >
                  <Plus size={13} /> {t.overview.urgent.receiveBtn}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
