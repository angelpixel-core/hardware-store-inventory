import type { Product, ProductLocation } from "../../types/inventory";

export interface StockIntakeFormData {
  productId: string;
  quantity: string;
  unitCost: string;
  note: string;
  location: ProductLocation;
}

export interface StockIntakeSubmitParams {
  productId: string;
  quantity: number;
  unitCost?: number;
  note?: string;
  location: ProductLocation;
  photo?: string;
}

export interface ReceiveStockModalProps {
  products: Product[];
  selectedProductId: string | null;
  onClose: () => void;
  onSubmit: (params: StockIntakeSubmitParams) => void;
}
