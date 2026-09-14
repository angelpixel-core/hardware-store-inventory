import { useMemo, useState } from "react";
import {
  Bell,
  Boxes,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  Map,
  PackageSearch,
  Search,
  Settings2,
  Warehouse,
} from "lucide-react";
import { mockProducts } from "../data";
import type { Product } from "../types/inventory";

type Section = "overview" | "products" | "inventory" | "locations" | "alerts";

const sections: Array<{ id: Section; label: string; icon: typeof Boxes }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Boxes },
  { id: "inventory", label: "Inventory", icon: Warehouse },
  { id: "locations", label: "Locations", icon: Map },
  { id: "alerts", label: "Alerts", icon: Bell },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

function stockStatus(product: Product) {
  if (product.stock === 0) return "out-of-stock";
  if (product.stock <= product.minimumStock) return "low-stock";
  return "in-stock";
}

function App() {
  const [section, setSection] = useState<Section>("products");
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return mockProducts;

    return mockProducts.filter((product) =>
      [
        product.name,
        product.brand,
        product.category,
        product.sku,
        product.barcode,
      ].some((value) => value.toLowerCase().includes(normalized)),
    );
  }, [query]);

  const lowStockCount = mockProducts.filter(
    (product) => stockStatus(product) !== "in-stock",
  ).length;

  const totalUnits = mockProducts.reduce(
    (sum, product) => sum + product.stock,
    0,
  );

  return (
    <div className="flex min-h-screen bg-[#f7f7f5] text-[#242424]">
      <aside className="flex w-60 shrink-0 flex-col border-r border-black/8 bg-[#fbfbf9]">
        <div className="flex h-18 items-center gap-3 border-b border-black/8 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#242424] text-white">
            <Warehouse size={17} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[-0.01em]">
              Inventory
            </p>
            <p className="text-[11px] text-black/45">Hardware Store</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/35">
            Workspace
          </p>

          <div className="space-y-1">
            {sections.map(({ id, label, icon: Icon }) => {
              const active = section === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setSection(id);
                    setSelectedProduct(null);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-black/[0.055] font-medium text-black"
                      : "text-black/55 hover:bg-black/[0.03] hover:text-black/80"
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2 : 1.7} />
                  <span>{label}</span>
                  {id === "alerts" && lowStockCount > 0 && (
                    <span className="ml-auto rounded-full bg-[#efe4d6] px-1.5 py-0.5 text-[10px] font-medium text-[#79552d]">
                      {lowStockCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-black/8 p-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-black/50 hover:bg-black/[0.03]">
            <Settings2 size={17} strokeWidth={1.7} />
            Settings
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-black/50 hover:bg-black/[0.03]">
            <CircleHelp size={17} strokeWidth={1.7} />
            Help
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-18 items-center justify-between border-b border-black/8 bg-[#f9f9f7] px-8">
          <div>
            <p className="text-xs text-black/40">Principal store</p>
            <h1 className="text-[15px] font-semibold">
              {sections.find((item) => item.id === section)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products, SKU or barcode..."
                className="h-9 w-full rounded-lg border border-black/10 bg-white pl-9 pr-3 text-xs outline-none transition placeholder:text-black/30 focus:border-black/25 focus:ring-2 focus:ring-black/5"
              />
            </div>
            <div className="h-7 w-px bg-black/8" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5e5e1] text-xs font-medium">
              AP
            </div>
          </div>
        </header>

        <div className="p-8">
          {section === "products" && !selectedProduct && (
            <ProductsView
              products={filteredProducts}
              totalUnits={totalUnits}
              lowStockCount={lowStockCount}
              onSelect={setSelectedProduct}
              formatCurrency={formatCurrency}
            />
          )}

          {section === "products" && selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
              formatCurrency={formatCurrency}
            />
          )}

          {section !== "products" && (
            <PlaceholderView
              section={section}
              products={mockProducts}
              lowStockCount={lowStockCount}
              totalUnits={totalUnits}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function ProductsView({
  products,
  totalUnits,
  lowStockCount,
  onSelect,
  formatCurrency,
}: {
  products: Product[];
  totalUnits: number;
  lowStockCount: number;
  onSelect: (product: Product) => void;
  formatCurrency: (value: number) => string;
}) {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs text-black/40">Inventory catalog</p>
          <h2 className="text-2xl font-semibold tracking-[-0.025em]">
            Products
          </h2>
        </div>
        <button className="rounded-lg bg-[#242424] px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-black">
          Add product
        </button>
      </div>

      <div className="mb-7 grid grid-cols-3 gap-3">
        <Metric label="Products" value={products.length.toString()} />
        <Metric
          label="Units in stock"
          value={totalUnits.toLocaleString("es-AR")}
        />
        <Metric
          label="Needs attention"
          value={lowStockCount.toString()}
          subtle
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-black/8 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.025)]">
        <div className="grid grid-cols-[minmax(280px,2fr)_1fr_120px_170px_32px] gap-4 border-b border-black/7 bg-black/[0.018] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.09em] text-black/35">
          <span>Product</span>
          <span>Category</span>
          <span>Stock</span>
          <span>Location</span>
          <span />
        </div>

        {products.map((product) => {
          const status = stockStatus(product);
          return (
            <button
              key={product.id}
              onClick={() => onSelect(product)}
              className="grid w-full grid-cols-[minmax(280px,2fr)_1fr_120px_170px_32px] items-center gap-4 border-b border-black/6 px-5 py-4 text-left transition last:border-0 hover:bg-black/[0.018]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#f0f0ed]">
                  <img
                    src={product.image}
                    alt=""
                    className="h-full w-full object-cover opacity-90"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-black/40">
                    {product.brand} · {product.sku}
                  </p>
                </div>
              </div>

              <span className="truncate text-xs text-black/55">
                {product.category}
              </span>

              <div>
                <p className="text-sm font-medium">{product.stock}</p>
                <p
                  className={`mt-0.5 text-[10px] ${
                    status === "in-stock"
                      ? "text-black/35"
                      : "font-medium text-[#8a6034]"
                  }`}
                >
                  {status === "in-stock"
                    ? "Healthy"
                    : status === "low-stock"
                      ? "Low stock"
                      : "Out of stock"}
                </p>
              </div>

              <div className="text-xs text-black/55">
                <p>
                  {product.location.aisle} · {product.location.rack} ·{" "}
                  {product.location.shelf}
                </p>
                <p className="mt-0.5 text-[10px] text-black/35">
                  {product.location.store}
                </p>
              </div>

              <ChevronRight size={16} className="text-black/20" />
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] text-black/30">
        Showing {products.length} products from local mock data.
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  subtle = false,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/8 bg-white px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-black/35">
        {label}
      </p>
      <p
        className={`mt-2 text-xl font-semibold tracking-[-0.02em] ${subtle ? "text-[#8a6034]" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function ProductDetail({
  product,
  onBack,
  formatCurrency,
}: {
  product: Product;
  onBack: () => void;
  formatCurrency: (value: number) => string;
}) {
  const status = stockStatus(product);

  return (
    <div className="mx-auto max-w-[1100px]">
      <button
        onClick={onBack}
        className="mb-6 text-xs font-medium text-black/45 transition hover:text-black"
      >
        ← Back to products
      </button>

      <div className="grid grid-cols-[minmax(0,1.1fr)_1fr] gap-8">
        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
          <div className="aspect-[4/3] bg-[#f0f0ed]">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-black/40">{product.brand}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.025em]">
            {product.name}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-black/50">
            {product.description}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <Detail label="SKU" value={product.sku} />
            <Detail label="Barcode" value={product.barcode} />
            <Detail label="Price" value={formatCurrency(product.price)} />
            <Detail label="Cost" value={formatCurrency(product.cost)} />
          </div>

          <div className="mt-3 rounded-xl border border-black/8 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-black/35">
                  Current stock
                </p>
                <p className="mt-1 text-2xl font-semibold">{product.stock}</p>
                <p className="mt-0.5 text-[11px] text-black/35">
                  {product.unit}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  status === "in-stock"
                    ? "bg-[#e5eee8] text-[#41634f]"
                    : status === "low-stock"
                      ? "bg-[#f1e7da] text-[#805b35]"
                      : "bg-[#f0dfdf] text-[#854949]"
                }`}
              >
                {status === "in-stock"
                  ? "Healthy"
                  : status === "low-stock"
                    ? "Low stock"
                    : "Out of stock"}
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-black/8 bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-black/35">
              Physical location
            </p>
            <p className="mt-2 text-sm font-medium">{product.location.store}</p>
            <p className="mt-1 text-xs text-black/45">
              Aisle {product.location.aisle} · Rack {product.location.rack} ·
              Shelf {product.location.shelf}
            </p>
            <button className="mt-4 flex items-center gap-1.5 text-xs font-medium text-black/60 hover:text-black">
              View on map <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/8 bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-black/35">
        {label}
      </p>
      <p className="mt-2 truncate text-xs font-medium">{value}</p>
    </div>
  );
}

function PlaceholderView({
  section,
  products,
  lowStockCount,
  totalUnits,
}: {
  section: Section;
  products: Product[];
  lowStockCount: number;
  totalUnits: number;
}) {
  const copy: Record<Section, { title: string; body: string }> = {
    overview: {
      title: "Inventory at a glance",
      body: `${products.length} products and ${totalUnits} units are currently represented in the local dataset.`,
    },

    products: {
      title: "Products",
      body: "Browse and search the product catalog.",
    },

    inventory: {
      title: "Inventory movements",
      body: "The movement ledger will be connected in the next slice.",
    },

    locations: {
      title: "Physical locations",
      body: "The location model is ready for the warehouse map experience.",
    },

    alerts: {
      title: "Stock alerts",
      body: `${lowStockCount} products are currently at or below their minimum stock threshold.`,
    },
  };

  const content = copy[section];

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="rounded-2xl border border-black/8 bg-white p-10">
        <PackageSearch size={20} className="text-black/35" />
        <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em]">
          {content.title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
          {content.body}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black/[0.035] px-3 py-2 text-xs text-black/45">
          This section is intentionally scoped for the next implementation
          slice.
        </div>
      </div>
    </div>
  );
}

export default App;

