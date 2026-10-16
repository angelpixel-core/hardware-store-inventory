import type { Product } from "../../types/inventory";

export type AlertSeverity = "CRITICAL" | "WARNING" | "OVERSTOCK";

export interface InventoryAlert {
  id: string;
  productId: string;
  product: Product;
  severity: AlertSeverity;
  title: string;
  message: string;
  currentStock: number;
  minimumStock: number;
  targetStock: number;
  deficit: number;
  unitCost: number;
  estimatedCost: number;
  suggestedReorderQuantity: number;
  locationLabel: string;
}

export interface AlertsKPIs {
  totalAlerts: number;
  criticalCount: number;
  warningCount: number;
  overstockCount: number;
  totalReplenishmentCost: number;
}

export type AlertFilterSeverity = "ALL" | AlertSeverity;

export interface PurchaseOrderItem {
  productId: string;
  name: string;
  sku: string;
  brand: string;
  unit: string;
  quantityToOrder: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrderDraft {
  items: PurchaseOrderItem[];
  totalItems: number;
  totalUnits: number;
  totalEstimatedCost: number;
}

export interface AlertsViewProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onReceive: (productId?: string) => void;
}
