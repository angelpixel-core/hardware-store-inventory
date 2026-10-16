import { AlertTriangle, Package } from "lucide-react";
import { SummaryCard } from "../../../components/ui";
import { useTranslation } from "../../../i18n";

export interface MetricsCardsProps {
  totalUnits: number;
  productCount: number;
  lowStockCount: number;
}

export function MetricsCards({
  totalUnits,
  productCount,
  lowStockCount,
}: MetricsCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      <SummaryCard
        label={t.inventory.kpis.totalUnits}
        value={totalUnits.toLocaleString()}
        icon={<Package size={17} />}
      />
      <SummaryCard
        label={t.inventory.kpis.activeProducts}
        value={productCount.toString()}
        icon={<Package size={17} />}
      />
      <SummaryCard
        label={t.inventory.kpis.lowStockCount}
        value={lowStockCount.toString()}
        icon={<AlertTriangle size={17} />}
        warning={lowStockCount > 0}
      />
    </div>
  );
}
