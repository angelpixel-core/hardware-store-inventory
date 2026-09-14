export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface Location {
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
  location: Location;
  description: string;
  image: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "receive" | "sale" | "adjustment";
  quantity: number;
  note: string;
  date: string;
}

