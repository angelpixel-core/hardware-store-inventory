import { useEffect, useMemo, useState } from "react";
import { mockMovements, mockProducts } from "../data";
import { Sidebar } from "../components/layout";
import { Placeholder } from "../components/ui";
import { ProductsView } from "../features/catalog";
import { InventoryView } from "../features/inventory-movements";
import { ProductDrawer } from "../features/product-detail";
import { ReceiveStockModal } from "../features/receive-stock";
import type { Product, ProductLocation, StockMovement } from "../types/inventory";
import type { Section } from "../types/navigation";

export function App() {
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );

  const [section, setSection] = useState<Section>(
    () => (searchParams.get("section") as Section) || "products",
  );
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    () => searchParams.get("product"),
  );
  const [showReceive, setShowReceive] = useState<boolean>(
    () => searchParams.get("receive") === "true",
  );
  const [receiveTargetProductId, setReceiveTargetProductId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timeout);
  }, [notice]);

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

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId),
    [products, selectedProductId],
  );

  function handleReceiveStock(params: {
    productId: string;
    quantity: number;
    unitCost?: number;
    note?: string;
    location: ProductLocation;
    photo?: string;
  }) {
    const targetProduct = products.find((item) => item.id === params.productId);
    const delta = params.quantity;

    setProducts((prev) =>
      prev.map((item) =>
        item.id === params.productId
          ? {
              ...item,
              stock: item.stock + delta,
              cost: params.unitCost ?? item.cost,
              location: params.location,
              image: params.photo ?? item.image,
            }
          : item,
      ),
    );

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: params.productId,
      type: "PURCHASE",
      quantity: delta,
      unitCost: params.unitCost,
      location: params.location,
      note: params.note || (params.photo ? "Photo attached" : undefined),
      createdAt: new Date().toISOString(),
    };

    setMovements((prev) => [movement, ...prev]);
    setShowReceive(false);
    setReceiveTargetProductId(null);
    setNotice(
      `Received ${delta} ${targetProduct?.unit ?? "units"} of ${targetProduct?.name ?? "product"}.`,
    );
  }

  function openReceive(productId?: string) {
    setReceiveTargetProductId(productId ?? selectedProductId ?? null);
    setShowReceive(true);
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <Sidebar section={section} onChange={setSection} />

      <main className="flex-1 overflow-y-auto">
        {notice && (
          <div className="border-b border-emerald-100 bg-emerald-50 px-8 py-2.5 text-xs font-medium text-emerald-800">
            {notice}
          </div>
        )}

        {section === "products" && (
          <ProductsView
            products={filteredProducts}
            search={search}
            onSearch={setSearch}
            onSelectProduct={(id) => setSelectedProductId(id)}
            onReceive={openReceive}
          />
        )}

        {section === "inventory" && (
          <InventoryView
            products={products}
            movements={movements}
            onReceive={() => openReceive()}
          />
        )}

        {section !== "products" && section !== "inventory" && (
          <Placeholder section={section} />
        )}
      </main>

      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          movements={movements}
          onClose={() => setSelectedProductId(null)}
          onReceive={(id) => {
            setSelectedProductId(null);
            openReceive(id);
          }}
        />
      )}

      {showReceive && (
        <ReceiveStockModal
          products={products}
          selectedProductId={receiveTargetProductId}
          onClose={() => {
            setShowReceive(false);
            setReceiveTargetProductId(null);
          }}
          onSubmit={handleReceiveStock}
        />
      )}
    </div>
  );
}

export default App;
