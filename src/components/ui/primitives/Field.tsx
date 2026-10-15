export interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  min,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-slate-500">{label}</span>
      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      />
    </label>
  );
}
