import type { ReactNode } from "react";

export interface SummaryCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  warning?: boolean;
}

export function SummaryCard({
  label,
  value,
  icon,
  warning,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            warning
              ? "bg-amber-50 text-amber-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {icon}
        </span>
      </div>
      <div className="text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}
