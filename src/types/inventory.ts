export interface ProductLocation {
  store: string;
  aisle: string;
  rack: string;
  shelf: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  barcode: string;
  unit: string;
  stock: number;
  minimumStock: number;
  price: number;
  cost: number;
  location: ProductLocation;
  description: string;
  image?: string;
}

export type StockMovementType = "PURCHASE" | "SALE" | "RETURN" | "ADJUSTMENT";

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  unitCost?: number;
  location: ProductLocation;
  note?: string;
  createdAt: string;
}
