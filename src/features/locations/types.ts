import type { Product, ProductLocation } from "../../types/inventory";

export interface AisleInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  productCount: number;
  totalUnits: number;
  racksCount: number;
  shelvesCount: number;
  products: Product[];
}

export interface RackInfo {
  id: string;
  aisleId: string;
  name: string;
  productCount: number;
  totalUnits: number;
  shelvesCount: number;
  products: Product[];
}

export interface ShelfInfo {
  id: string;
  rackId: string;
  aisleId: string;
  name: string;
  productCount: number;
  totalUnits: number;
  products: Product[];
}

export interface PickingMatch {
  product: Product;
  location: ProductLocation;
  locationLabel: string;
  inStock: boolean;
}

export interface LocationsKPIs {
  totalAisles: number;
  totalRacks: number;
  totalShelves: number;
  assignedProducts: number;
  totalUnitsStored: number;
}

export interface LocationsViewProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onReceive: (productId?: string) => void;
  onRelocateProduct?: (productId: string, newLocation: ProductLocation) => void;
}
