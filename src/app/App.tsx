import { useMemo, useState } from "react";
import { Sidebar } from "../components/layout";
import { AlertsView } from "../features/alerts";
import { LocationsView } from "../features/locations";
import { OverviewView } from "../features/overview";
import { ProductsView } from "../features/catalog";
import { InventoryView } from "../features/inventory";
import { ProductDrawer } from "../features/product-detail";
import { ReceiveStockModal } from "../features/stock-intake";
import { useInventoryState } from "../hooks";
import { exportDatabaseBackup } from "../services/db";
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
    isDbLoading,
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
    relocateProduct,
    createProduct,
    adjustStock,
    notice,
  } = useInventoryState({
    initialSearch: searchParams.get("search") || "",
    initialProductId: searchParams.get("product"),
    initialReceiveOpen: searchParams.get("receive") === "true",
  });

  if (isDbLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-400 border-t-transparent" />
          <p className="text-sm font-semibold tracking-wide text-slate-100">
            Conectando a base de datos SQLite y verificando migraciones...
          </p>
          <p className="text-xs text-slate-400">
            Cargando inventario persistente y libro mayor de existencias.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <Sidebar
        section={section}
        onChange={setSection}
        onExportBackup={() => {
          exportDatabaseBackup();
        }}
      />

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
            onCreateProduct={createProduct}
          />
        )}

        {section === "inventory" && (
          <InventoryView
            products={products}
            movements={movements}
            onReceive={() => openReceive()}
            onAdjustStock={adjustStock}
          />
        )}

        {section === "alerts" && (
          <AlertsView
            products={products}
            onSelectProduct={selectProduct}
            onReceive={openReceive}
          />
        )}

        {section === "locations" && (
          <LocationsView
            products={products}
            onSelectProduct={selectProduct}
            onReceive={openReceive}
            onRelocateProduct={relocateProduct}
          />
        )}
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
