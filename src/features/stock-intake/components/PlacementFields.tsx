import { Field } from "../../../components/ui";
import type { ProductLocation } from "../../../types/inventory";

export interface PlacementFieldsProps {
  location: ProductLocation;
  onChange: (location: ProductLocation) => void;
}

export function PlacementFields({ location, onChange }: PlacementFieldsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Store Placement
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Field
          label="Aisle"
          value={location.aisle}
          onChange={(value) => onChange({ ...location, aisle: value })}
        />
        <Field
          label="Rack"
          value={location.rack}
          onChange={(value) => onChange({ ...location, rack: value })}
        />
        <Field
          label="Shelf"
          value={location.shelf}
          onChange={(value) => onChange({ ...location, shelf: value })}
        />
      </div>
    </div>
  );
}
