import type { Product, StockMovement } from "../../types/inventory";
import type { Section } from "../../types/navigation";

export interface OverviewKPIs {
  totalInventoryCost: number;
  totalInventoryValue: number;
  projectedProfit: number;
  projectedMarginPercent: number;
  totalUnits: number;
  totalSkus: number;
  outOfStockCount: number;
  lowStockCount: number;
}

export interface CategoryDistribution {
  category: string;
  productCount: number;
  totalUnits: number;
  totalCost: number;
  totalValue: number;
  percentOfUnits: number;
}

export interface MovementTrendPoint {
  date: string;
  label: string;
  purchases: number;
  sales: number;
  adjustments: number;
  totalVolume: number;
}

export interface CriticalProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  stock: number;
  minimumStock: number;
  deficit: number;
  locationLabel: string;
  status: "OUT_OF_STOCK" | "LOW_STOCK";
}

export interface OverviewMetricsHookResult {
  kpis: OverviewKPIs;
  categoryDistribution: CategoryDistribution[];
  movementTrends: MovementTrendPoint[];
  criticalProducts: CriticalProduct[];
  recentMovements: StockMovement[];
}

export interface OverviewViewProps {
  products: Product[];
  movements: StockMovement[];
  onNavigateSection: (section: Section) => void;
  onSelectProduct: (id: string) => void;
  onReceive: (productId?: string) => void;
}
