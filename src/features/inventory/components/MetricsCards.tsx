import { AlertTriangle, Package } from "lucide-react";
import { SummaryCard } from "../../../components/ui";

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
  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      <SummaryCard
        label="Total Units in Store"
        value={totalUnits.toLocaleString("es-AR")}
        icon={<Package size={17} />}
      />
      <SummaryCard
        label="Active Products"
        value={productCount.toString()}
        icon={<Package size={17} />}
      />
      <SummaryCard
        label="Low Stock Items"
        value={lowStockCount.toString()}
        icon={<AlertTriangle size={17} />}
        warning={lowStockCount > 0}
      />
    </div>
  );
}
