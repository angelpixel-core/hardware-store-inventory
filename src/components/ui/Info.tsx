export interface InfoProps {
  label: string;
  value: string;
}

export function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-medium text-slate-700">
        {value}
      </div>
    </div>
  );
}
