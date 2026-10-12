import {
  CircleAlert,
  ClipboardList,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
} from "lucide-react";
import type { Section } from "../../types/navigation";

export interface SidebarProps {
  section: Section;
  onChange: (section: Section) => void;
}

export function Sidebar({ section, onChange }: SidebarProps) {
  const items: { id: Section; label: string; icon: typeof LayoutDashboard }[] =
    [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "products", label: "Products", icon: Package },
      { id: "inventory", label: "Inventory", icon: ClipboardList },
      { id: "locations", label: "Locations", icon: MapPin },
      { id: "alerts", label: "Alerts", icon: CircleAlert },
    ];
  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-[72px] items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Package size={19} />
        </div>
        <div>
          <div className="text-sm font-semibold">Inventory</div>
          <div className="text-[11px] text-slate-400">Hardware Store</div>
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
      <div className="border-t border-slate-100 p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50">
          <Settings size={17} />
          Settings
        </button>
      </div>
    </aside>
  );
}
