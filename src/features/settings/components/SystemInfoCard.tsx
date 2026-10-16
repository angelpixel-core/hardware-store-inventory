import { Database, Download, Server } from "lucide-react";
import { useTranslation } from "../../../i18n";

export interface SystemInfoCardProps {
  productsCount: number;
  movementsCount: number;
  onExportBackup: () => void;
}

export function SystemInfoCard({
  productsCount,
  movementsCount,
  onExportBackup,
}: SystemInfoCardProps) {
  const { t } = useTranslation();

  const isTauriNative =
    typeof window !== "undefined" &&
    ("__TAURI_INTERNALS__" in window || "__TAURI__" in window);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
          <Server size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            {t.settings.system.title}
          </h2>
          <p className="text-xs text-slate-500">
            {t.settings.system.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase">
            {t.settings.system.version}
          </span>
          <div className="mt-1 text-sm font-bold text-slate-900">v0.2.0</div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase">
            {t.settings.system.runtime}
          </span>
          <div className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-900">
            <span
              className={`h-2 w-2 rounded-full ${
                isTauriNative ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {isTauriNative ? "Tauri v2 Desktop Shell" : "Web Preview Mode"}
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase">
            {t.settings.system.database}
          </span>
          <div className="mt-1 text-sm font-bold text-slate-900">
            SQLite (PRAGMA WAL)
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase">
            {t.settings.system.migrations}
          </span>
          <div className="mt-1 text-sm font-bold text-slate-900">
            3 migraciones aplicadas
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase">
            {t.settings.system.productsTotal}
          </span>
          <div className="mt-1 text-sm font-bold text-slate-900">
            {productsCount} SKUs
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase">
            {t.settings.system.movementsTotal}
          </span>
          <div className="mt-1 text-sm font-bold text-slate-900">
            {movementsCount} registros
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Database size={17} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900">
              {t.settings.system.backupBtn}
            </div>
            <div className="text-[11px] text-slate-500">
              {t.settings.system.backupDesc}
            </div>
          </div>
        </div>

        <button
          onClick={onExportBackup}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 shrink-0"
        >
          <Download size={14} />
          {t.settings.system.backupBtn}
        </button>
      </div>
    </div>
  );
}
