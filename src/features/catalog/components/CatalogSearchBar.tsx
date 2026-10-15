import { Search } from "lucide-react";

export interface CatalogSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CatalogSearchBar({
  value,
  onChange,
  placeholder = "Search name, brand, category, SKU, barcode...",
}: CatalogSearchBarProps) {
  return (
    <div className="relative mb-5 max-w-sm">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-slate-400"
      />
    </div>
  );
}
