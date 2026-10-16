import {
  CircleAlert,
  ClipboardList,
  Database,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
} from "lucide-react";
import { useTranslation } from "../../i18n";
import type { Section } from "../../types/navigation";

export interface SidebarProps {
  section: Section;
  onChange: (section: Section) => void;
  onExportBackup?: () => void;
}

export function Sidebar({ section, onChange, onExportBackup }: SidebarProps) {
  const { t } = useTranslation();

  const items: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: t.nav.overview, icon: LayoutDashboard },
    { id: "products", label: t.nav.products, icon: Package },
    { id: "inventory", label: t.nav.inventory, icon: ClipboardList },
    { id: "locations", label: t.nav.locations, icon: MapPin },
    { id: "alerts", label: t.nav.alerts, icon: CircleAlert },
    { id: "settings", label: t.nav.settings, icon: Settings },
  ];

  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-[72px] items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Package size={19} />
        </div>
        <div>
          <div className="text-sm font-semibold">{t.nav.appName}</div>
          <div className="text-[11px] text-slate-400">{t.nav.appSubtitle}</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-5">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
              section === id
                ? "bg-slate-100 font-medium text-slate-900"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>
      {onExportBackup && (
        <div className="border-t border-slate-100 p-3">
          <button
            onClick={onExportBackup}
            className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            title={t.nav.backupDbTitle}
          >
            <Database size={15} className="text-slate-500" />
            <span>{t.nav.backupDb}</span>
          </button>
        </div>
      )}
    </aside>
  );
}
