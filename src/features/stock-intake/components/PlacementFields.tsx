import { Field } from "../../../components/ui";
import { useTranslation } from "../../../i18n";
import type { ProductLocation } from "../../../types/inventory";

export interface PlacementFieldsProps {
  location: ProductLocation;
  onChange: (location: ProductLocation) => void;
}

export function PlacementFields({ location, onChange }: PlacementFieldsProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {t.stockIntake.storePlacement}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Field
          label={t.stockIntake.aisle}
          value={location.aisle}
          onChange={(value) => onChange({ ...location, aisle: value })}
        />
        <Field
          label={t.stockIntake.rack}
          value={location.rack}
          onChange={(value) => onChange({ ...location, rack: value })}
        />
        <Field
          label={t.stockIntake.shelf}
          value={location.shelf}
          onChange={(value) => onChange({ ...location, shelf: value })}
        />
      </div>
    </div>
  );
}
