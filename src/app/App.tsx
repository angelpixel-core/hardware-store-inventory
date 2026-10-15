import { useMemo, useState } from "react";
import { Sidebar } from "../components/layout";
import { Placeholder } from "../components/ui";
import { AlertsView } from "../features/alerts";
import { OverviewView } from "../features/overview";
import { ProductsView } from "../features/catalog";
import { InventoryView } from "../features/inventory";
import { ProductDrawer } from "../features/product-detail";
import { ReceiveStockModal } from "../features/stock-intake";
import { useInventoryState } from "../hooks";
import type { Section } from "../types/navigation";

export function App() {
  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );

  const [section, setSection] = useState<Section>(
    () => (searchParams.get("section") as Section) || "overview",
  );

  const {
    products,
    movements,
    filteredProducts,
    selectedProduct,
    search,
    setSearch,
    selectProduct,
    isReceiveOpen,
    receiveTargetProductId,
    openReceive,
    closeReceive,
    receiveStock,
    notice,
  } = useInventoryState({
    initialSearch: searchParams.get("search") || "",
    initialProductId: searchParams.get("product"),
    initialReceiveOpen: searchParams.get("receive") === "true",
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <Sidebar section={section} onChange={setSection} />

      <main className="flex-1 overflow-y-auto">
        {notice && (
          <div className="border-b border-emerald-100 bg-emerald-50 px-8 py-2.5 text-xs font-medium text-emerald-800">
            {notice}
          </div>
        )}

        {section === "overview" && (
          <OverviewView
            products={products}
            movements={movements}
            onNavigateSection={setSection}
            onSelectProduct={selectProduct}
            onReceive={openReceive}
          />
        )}

        {section === "products" && (
          <ProductsView
            products={filteredProducts}
            search={search}
            onSearch={setSearch}
            onSelectProduct={selectProduct}
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

        {section === "alerts" && (
          <AlertsView
            products={products}
            onSelectProduct={selectProduct}
            onReceive={openReceive}
          />
        )}

        {section !== "overview" &&
          section !== "products" &&
          section !== "inventory" &&
          section !== "alerts" && <Placeholder section={section} />}
      </main>

      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          movements={movements}
          onClose={() => selectProduct(null)}
          onReceive={(id) => {
            selectProduct(null);
            openReceive(id);
          }}
        />
      )}

      {isReceiveOpen && (
        <ReceiveStockModal
          products={products}
          selectedProductId={receiveTargetProductId}
          onClose={closeReceive}
          onSubmit={receiveStock}
        />
      )}
    </div>
  );
}

export default App;
