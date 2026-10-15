import { useEffect, useMemo, useState } from "react";
import {
  initDatabase,
  productRepository,
  movementRepository,
} from "../services/db";
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
  // Persistence state
  isDbLoading: boolean;

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
  receiveStock: (input: ReceiveStockInput) => Promise<void>;
  relocateProduct: (productId: string, newLocation: ProductLocation) => Promise<void>;
  createProduct: (input: CreateProductInput) => Promise<void>;
  adjustStock: (input: AdjustStockInput) => Promise<void>;

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

  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialProductId,
  );
  const [isReceiveOpen, setIsReceiveOpen] = useState(initialReceiveOpen);
  const [receiveTargetProductId, setReceiveTargetProductId] = useState<
    string | null
  >(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Initialize SQLite database and load persisted records
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsDbLoading(true);
        await initDatabase();
        const [loadedProducts, loadedMovements] = await Promise.all([
          productRepository.loadAllProducts(),
          movementRepository.loadAllMovements(),
        ]);

        if (isMounted) {
          setProducts(loadedProducts);
          setMovements(loadedMovements);
        }
      } catch (error) {
        console.error("[useInventoryState] Error initializing database:", error);
        if (isMounted) {
          setNotice("Aviso: Error conectando a SQLite. Se activó respaldo en memoria.");
        }
      } finally {
        if (isMounted) {
          setIsDbLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

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

  async function receiveStock(input: ReceiveStockInput) {
    const targetProduct = products.find((item) => item.id === input.productId);
    const delta = input.quantity;
    const newStock = (targetProduct?.stock ?? 0) + delta;

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

    try {
      if (targetProduct) {
        await productRepository.updateProductStock(targetProduct.id, newStock);
        await productRepository.updateProductLocation(targetProduct.id, input.location);
      }
      await movementRepository.insertMovement(movement);

      setProducts((prev) =>
        prev.map((item) =>
          item.id === input.productId
            ? {
                ...item,
                stock: newStock,
                cost: input.unitCost ?? item.cost,
                location: input.location,
                image: input.photo ?? item.image,
              }
            : item,
        ),
      );
      setMovements((prev) => [movement, ...prev]);
      closeReceive();
      setNotice(
        `Received ${delta} ${targetProduct?.unit ?? "units"} of ${targetProduct?.name ?? "product"}.`,
      );
    } catch (err) {
      console.error("[useInventoryState] Error in receiveStock:", err);
      setNotice("Error al persistir la recepción de stock en la base de datos.");
    }
  }

  async function relocateProduct(productId: string, newLocation: ProductLocation) {
    const targetProduct = products.find((item) => item.id === productId);
    try {
      await productRepository.updateProductLocation(productId, newLocation);
      setProducts((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, location: newLocation } : item,
        ),
      );
      setNotice(
        `Reubicado "${targetProduct?.name ?? productId}" a ${newLocation.aisle} · ${newLocation.rack} · ${newLocation.shelf}.`,
      );
    } catch (err) {
      console.error("[useInventoryState] Error in relocateProduct:", err);
      setNotice("Error al persistir la reubicación en la base de datos.");
    }
  }

  async function createProduct(input: CreateProductInput) {
    const newId = `p-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...input,
      id: newId,
    };

    let initialMovement: StockMovement | null = null;
    if (input.stock > 0) {
      initialMovement = {
        id: `mov-${Date.now()}`,
        productId: newId,
        type: "PURCHASE",
        quantity: input.stock,
        unitCost: input.cost,
        location: input.location,
        note: "Stock inicial de alta de producto",
        createdAt: new Date().toISOString(),
      };
    }

    try {
      await productRepository.insertProduct(newProduct);
      if (initialMovement) {
        await movementRepository.insertMovement(initialMovement);
      }

      setProducts((prev) => [newProduct, ...prev]);
      if (initialMovement) {
        setMovements((prev) => [initialMovement!, ...prev]);
      }
      setNotice(`Producto "${input.name}" creado con SKU ${input.sku}.`);
    } catch (err) {
      console.error("[useInventoryState] Error in createProduct:", err);
      setNotice("Error al guardar el nuevo producto en la base de datos.");
    }
  }

  async function adjustStock(input: AdjustStockInput) {
    const targetProduct = products.find((item) => item.id === input.productId);
    if (!targetProduct) return;

    const newStock = Math.max(0, targetProduct.stock + input.delta);

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

    try {
      await productRepository.updateProductStock(input.productId, newStock);
      await movementRepository.insertMovement(movement);

      setProducts((prev) =>
        prev.map((item) =>
          item.id === input.productId ? { ...item, stock: newStock } : item,
        ),
      );
      setMovements((prev) => [movement, ...prev]);
      setNotice(
        `Ajuste registrado para "${targetProduct.name}": ${input.delta > 0 ? `+${input.delta}` : input.delta} ${targetProduct.unit} (${input.reason}).`,
      );
    } catch (err) {
      console.error("[useInventoryState] Error in adjustStock:", err);
      setNotice("Error al persistir el ajuste en la base de datos.");
    }
  }

  return {
    isDbLoading,
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
