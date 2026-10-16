import { useTranslation } from "../../i18n";
import {
  LanguageSelector,
  RegionalPreview,
  SystemInfoCard,
} from "./components";

export interface SettingsViewProps {
  productsCount: number;
  movementsCount: number;
  onExportBackup: () => void;
}

export function SettingsView({
  productsCount,
  movementsCount,
  onExportBackup,
}: SettingsViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {t.settings.title}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          {t.settings.subtitle}
        </p>
      </div>

      {/* Language Preferences */}
      <LanguageSelector />

      {/* Regional Formats Live Preview */}
      <RegionalPreview />

      {/* System Diagnostics & Persistence Info */}
      <SystemInfoCard
        productsCount={productsCount}
        movementsCount={movementsCount}
        onExportBackup={onExportBackup}
      />
    </div>
  );
}
