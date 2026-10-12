import { BarChart3 } from "lucide-react";
import type { Section } from "../../types/navigation";

export interface PlaceholderProps {
  section: Exclude<Section, "products" | "inventory">;
}

export function Placeholder({ section }: PlaceholderProps) {
  const copy: Record<typeof section, { title: string; body: string }> = {
    overview: {
      title: "Overview",
      body: "Dashboard metrics will be connected to inventory data in the next iteration.",
    },
    locations: {
      title: "Locations",
      body: "Physical store mapping will be added after the receiving workflow.",
    },
    alerts: {
      title: "Alerts",
      body: "Low-stock rules are represented in the inventory summary for now.",
    },
  };
  return (
    <div className="mx-auto flex max-w-[900px] items-center justify-center py-28">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
          <BarChart3 size={22} />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">
          {copy[section].title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {copy[section].body}
        </p>
      </div>
    </div>
  );
}
