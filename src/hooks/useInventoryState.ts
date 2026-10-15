import { useEffect, useMemo, useState } from "react";
import { mockMovements, mockProducts } from "../data";
import type {
  Product,
  ProductLocation,
  StockMovement,
} from "../types/inventory";

export interface ReceiveStockInput {
  productId: string;
  quantity: number;
  unitCost?: number;
  note?: string;
  location: ProductLocation;
  photo?: string;
}

export interface CreateProductInput {
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

export interface AdjustStockInput {
  productId: string;
  delta: number;
  reason: string;
}

export interface UseInventoryStateReturn {
  // Data
  products: Product[];
  movements: StockMovement[];
  filteredProducts: Product[];
  selectedProduct: Product | null;
  totalUnits: number;
  lowStockCount: number;

  // Search
  search: string;
  setSearch: (query: string) => void;

  // Selection
  selectedProductId: string | null;
  selectProduct: (id: string | null) => void;

  // Stock intake modal control
  isReceiveOpen: boolean;
  receiveTargetProductId: string | null;
  openReceive: (productId?: string) => void;
  closeReceive: () => void;

  // Actions
  receiveStock: (input: ReceiveStockInput) => void;
  relocateProduct: (productId: string, newLocation: ProductLocation) => void;
  createProduct: (input: CreateProductInput) => void;
  adjustStock: (input: AdjustStockInput) => void;

  // Feedback notifications
  notice: string | null;
  clearNotice: () => void;
}

export interface UseInventoryStateOptions {
  initialSearch?: string;
  initialProductId?: string | null;
  initialReceiveOpen?: boolean;
}

export function useInventoryState(
  options: UseInventoryStateOptions = {},
): UseInventoryStateReturn {
  const {
    initialSearch = "",
    initialProductId = null,
    initialReceiveOpen = false,
  } = options;

  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [search, setSearch] = useState(initialSearch);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialProductId,
  );
  const [isReceiveOpen, setIsReceiveOpen] = useState(initialReceiveOpen);
  const [receiveTargetProductId, setReceiveTargetProductId] = useState<
    string | null
  >(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Auto-dismiss notice after 3.5 seconds
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timeout);
  }, [notice]);

  // Filtered products based on search term
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.barcode.includes(query),
    );
  }, [products, search]);

  // Selected product object
  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

  // KPI Derivations
  const totalUnits = useMemo(
    () => products.reduce((acc, item) => acc + item.stock, 0),
    [products],
  );

  const lowStockCount = useMemo(
    () => products.filter((item) => item.stock <= item.minimumStock).length,
    [products],
  );

  function openReceive(productId?: string) {
    setReceiveTargetProductId(productId ?? selectedProductId ?? null);
    setIsReceiveOpen(true);
  }

  function closeReceive() {
    setIsReceiveOpen(false);
    setReceiveTargetProductId(null);
  }

  function receiveStock(input: ReceiveStockInput) {
    const targetProduct = products.find((item) => item.id === input.productId);
    const delta = input.quantity;

    setProducts((prev) =>
      prev.map((item) =>
        item.id === input.productId
          ? {
              ...item,
              stock: item.stock + delta,
              cost: input.unitCost ?? item.cost,
              location: input.location,
              image: input.photo ?? item.image,
            }
          : item,
      ),
    );

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: input.productId,
      type: "PURCHASE",
      quantity: delta,
      unitCost: input.unitCost,
      location: input.location,
      note: input.note || (input.photo ? "Photo attached" : undefined),
      createdAt: new Date().toISOString(),
    };

    setMovements((prev) => [movement, ...prev]);
    closeReceive();
    setNotice(
      `Received ${delta} ${targetProduct?.unit ?? "units"} of ${targetProduct?.name ?? "product"}.`,
    );
  }

  function relocateProduct(productId: string, newLocation: ProductLocation) {
    const targetProduct = products.find((item) => item.id === productId);
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, location: newLocation } : item,
      ),
    );
    setNotice(
      `Reubicado "${targetProduct?.name ?? productId}" a ${newLocation.aisle} · ${newLocation.rack} · ${newLocation.shelf}.`,
    );
  }

  function createProduct(input: CreateProductInput) {
    const newId = `p-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...input,
      id: newId,
    };

    setProducts((prev) => [newProduct, ...prev]);

    if (input.stock > 0) {
      const initialMovement: StockMovement = {
        id: `mov-${Date.now()}`,
        productId: newId,
        type: "PURCHASE",
        quantity: input.stock,
        unitCost: input.cost,
        location: input.location,
        note: "Stock inicial de alta de producto",
        createdAt: new Date().toISOString(),
      };
      setMovements((prev) => [initialMovement, ...prev]);
    }

    setNotice(`Producto "${input.name}" creado con SKU ${input.sku}.`);
  }

  function adjustStock(input: AdjustStockInput) {
    const targetProduct = products.find((item) => item.id === input.productId);
    if (!targetProduct) return;

    const newStock = Math.max(0, targetProduct.stock + input.delta);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === input.productId ? { ...item, stock: newStock } : item,
      ),
    );

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: input.productId,
      type: "ADJUSTMENT",
      quantity: input.delta,
      unitCost: targetProduct.cost,
      location: targetProduct.location,
      note: input.reason,
      createdAt: new Date().toISOString(),
    };

    setMovements((prev) => [movement, ...prev]);
    setNotice(
      `Ajuste registrado para "${targetProduct.name}": ${input.delta > 0 ? `+${input.delta}` : input.delta} ${targetProduct.unit} (${input.reason}).`,
    );
  }

  return {
    products,
    movements,
    filteredProducts,
    selectedProduct,
    totalUnits,
    lowStockCount,
    search,
    setSearch,
    selectedProductId,
    selectProduct: setSelectedProductId,
    isReceiveOpen,
    receiveTargetProductId,
    openReceive,
    closeReceive,
    receiveStock,
    relocateProduct,
    createProduct,
    adjustStock,
    notice,
    clearNotice: () => setNotice(null),
  };
}
