import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Camera,
  Check,
  ChevronDown,
  CircleAlert,
  ClipboardList,
  ImagePlus,
  LayoutDashboard,
  MapPin,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";
import { mockMovements, mockProducts } from "../data";
import type {
  Product,
  ProductLocation,
  StockMovement,
  StockMovementType,
} from "../types/inventory";

type Section = "overview" | "products" | "inventory" | "locations" | "alerts";

type ReceiveForm = {
  productId: string;
  quantity: string;
  unitCost: string;
  note: string;
  location: ProductLocation;
};

const movementLabels: Record<StockMovementType, string> = {
  PURCHASE: "Purchase",
  SALE: "Sale",
  RETURN: "Return",
  ADJUSTMENT: "Adjustment",
};

const movementClasses: Record<StockMovementType, string> = {
  PURCHASE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  SALE: "bg-slate-100 text-slate-700 ring-slate-200",
  RETURN: "bg-blue-50 text-blue-700 ring-blue-200",
  ADJUSTMENT: "bg-amber-50 text-amber-700 ring-amber-200",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function locationLabel(location: ProductLocation) {
  return `${location.aisle} · ${location.rack} · ${location.shelf}`;
}

function movementDelta(type: StockMovementType, quantity: number) {
  return type === "PURCHASE" || type === "RETURN" ? quantity : -quantity;
}

function App() {
  const [section, setSection] = useState<Section>("products");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [showReceive, setShowReceive] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) =>
      [
        product.name,
        product.brand,
        product.sku,
        product.barcode,
        product.category,
      ].some((value) => value.toLowerCase().includes(q)),
    );
  }, [products, search]);

  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? null;

  function receiveStock(form: ReceiveForm, photo?: string) {
    const product = products.find((item) => item.id === form.productId);
    const quantity = Number(form.quantity);
    const unitCost = Number(form.unitCost);
    if (!product || !Number.isFinite(quantity) || quantity <= 0) return;

    const movement: StockMovement = {
      id: crypto.randomUUID(),
      productId: product.id,
      type: "PURCHASE",
      quantity,
      unitCost:
        Number.isFinite(unitCost) && unitCost > 0 ? unitCost : undefined,
      location: form.location,
      note: form.note.trim() || "Stock received",
      createdAt: new Date().toISOString(),
    };

    setMovements((current) => [movement, ...current]);
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              stock: item.stock + quantity,
              cost: unitCost > 0 ? unitCost : item.cost,
              location: form.location,
              image: photo ?? item.image,
            }
          : item,
      ),
    );
    setShowReceive(false);
    setNotice(`${quantity} ${product.unit} added to ${product.name}`);
    window.setTimeout(() => setNotice(null), 3500);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f6f8] text-slate-800">
      <Sidebar section={section} onChange={setSection} />

      <main className="min-w-0 flex-1 overflow-hidden">
        <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-7">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Store size={17} />
            <span>Hardware Store</span>
            <ChevronDown size={15} />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-[360px]">
              <Search
                className="absolute left-3 top-2.5 text-slate-400"
                size={17}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products, SKU or barcode"
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
              AS
            </div>
          </div>
        </header>

        {notice && (
          <div className="absolute right-7 top-[88px] z-50 flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm shadow-lg">
            <Check size={17} className="text-emerald-600" /> {notice}
          </div>
        )}

        <div className="h-[calc(100vh-72px)] overflow-auto p-7">
          {section === "products" && (
            <ProductsView
              products={filteredProducts}
              onSelect={(id) => setSelectedProductId(id)}
              onReceive={() => setShowReceive(true)}
            />
          )}
          {section === "inventory" && (
            <InventoryView
              products={products}
              movements={movements}
              onReceive={() => setShowReceive(true)}
            />
          )}
          {section !== "products" && section !== "inventory" && (
            <Placeholder section={section} />
          )}
        </div>
      </main>

      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          movements={movements.filter(
            (movement) => movement.productId === selectedProduct.id,
          )}
          onClose={() => setSelectedProductId(null)}
          onReceive={() => {
            setSelectedProductId(null);
            setShowReceive(true);
          }}
        />
      )}
      {showReceive && (
        <ReceiveStockModal
          products={products}
          onClose={() => setShowReceive(false)}
          onReceive={receiveStock}
        />
      )}
    </div>
  );
}

function Sidebar({
  section,
  onChange,
}: {
  section: Section;
  onChange: (section: Section) => void;
}) {
  const items: { id: Section; label: string; icon: typeof LayoutDashboard }[] =
    [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "products", label: "Products", icon: Package },
      { id: "inventory", label: "Inventory", icon: ClipboardList },
      { id: "locations", label: "Locations", icon: MapPin },
      { id: "alerts", label: "Alerts", icon: CircleAlert },
    ];
  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-[72px] items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Package size={19} />
        </div>
        <div>
          <div className="text-sm font-semibold">Inventory</div>
          <div className="text-[11px] text-slate-400">Hardware Store</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-5">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${section === id ? "bg-slate-100 font-medium text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-50">
          <Settings size={17} />
          Settings
        </button>
      </div>
    </aside>
  );
}

function ProductsView({
  products,
  onSelect,
  onReceive,
}: {
  products: Product[];
  onSelect: (id: string) => void;
  onReceive: () => void;
}) {
  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Find a product and see where it is stored.
          </p>
        </div>
        <button
          onClick={onReceive}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          <ArrowDownToLine size={17} /> Receive stock
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.3fr_90px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Product</span>
          <span>SKU</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Location</span>
          <span></span>
        </div>
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelect(product.id)}
            className="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1.3fr_90px] items-center border-b border-slate-100 px-5 py-4 text-left last:border-0 hover:bg-slate-50"
          >
            <div>
              <div className="font-medium text-slate-800">{product.name}</div>
              <div className="mt-0.5 text-xs text-slate-400">
                {product.brand} · {product.category}
              </div>
            </div>
            <span className="text-sm text-slate-500">{product.sku}</span>
            <span className="text-sm font-medium">
              {formatCurrency(product.price)}
            </span>
            <StockBadge
              stock={product.stock}
              minimum={product.minimumStock}
              unit={product.unit}
            />
            <span className="text-sm text-slate-500">
              {locationLabel(product.location)}
            </span>
            <span className="flex justify-end">
              <ArrowRight size={17} className="text-slate-300" />
            </span>
          </button>
        ))}
        {products.length === 0 && (
          <div className="px-5 py-14 text-center text-sm text-slate-400">
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
}

function InventoryView({
  products,
  movements,
  onReceive,
}: {
  products: Product[];
  movements: StockMovement[];
  onReceive: () => void;
}) {
  const lowStock = products.filter(
    (product) => product.stock <= product.minimumStock,
  ).length;
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);
  return (
    <div className="mx-auto max-w-[1280px]">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track stock movements and receive new inventory.
          </p>
        </div>
        <button
          onClick={onReceive}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          <Plus size={17} /> Receive stock
        </button>
      </div>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <SummaryCard
          label="Total units"
          value={totalUnits.toLocaleString("es-AR")}
          icon={<Package size={18} />}
        />
        <SummaryCard
          label="Products"
          value={products.length.toString()}
          icon={<ShoppingCart size={18} />}
        />
        <SummaryCard
          label="Low stock"
          value={lowStock.toString()}
          icon={<AlertTriangle size={18} />}
          warning={lowStock > 0}
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">Recent movements</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Latest stock changes recorded in the store.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {movements.length} movements
          </span>
        </div>
        <div className="grid grid-cols-[1.2fr_2fr_1fr_1fr_1.2fr_1.5fr] border-b border-slate-100 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <span>Date</span>
          <span>Product</span>
          <span>Type</span>
          <span>Quantity</span>
          <span>Location</span>
          <span>Note</span>
        </div>
        {movements.map((movement) => {
          const product = products.find(
            (item) => item.id === movement.productId,
          );
          const positive =
            movement.type === "PURCHASE" || movement.type === "RETURN";
          return (
            <div
              key={movement.id}
              className="grid grid-cols-[1.2fr_2fr_1fr_1fr_1.2fr_1.5fr] items-center border-b border-slate-100 px-5 py-4 text-sm last:border-0"
            >
              <span className="text-slate-400">
                {formatDate(movement.createdAt)}
              </span>
              <span className="font-medium text-slate-700">
                {product?.name ?? "Unknown product"}
              </span>
              <span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${movementClasses[movement.type]}`}
                >
                  {movementLabels[movement.type]}
                </span>
              </span>
              <span
                className={`font-semibold ${positive ? "text-emerald-600" : "text-slate-700"}`}
              >
                {positive ? "+" : "−"}
                {movement.quantity} {product?.unit}
              </span>
              <span className="text-slate-500">
                {locationLabel(movement.location)}
              </span>
              <span className="truncate text-slate-400">
                {movement.note || "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  warning,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  warning?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${warning ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500"}`}
        >
          {icon}
        </span>
      </div>
      <div className="text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}

function StockBadge({
  stock,
  minimum,
  unit,
}: {
  stock: number;
  minimum: number;
  unit: string;
}) {
  const low = stock <= minimum;
  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${low ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}`}
    >
      {stock} {unit}
      {low ? " · Low" : ""}
    </span>
  );
}

function ProductDrawer({
  product,
  movements,
  onClose,
  onReceive,
}: {
  product: Product;
  movements: StockMovement[];
  onClose: () => void;
  onReceive: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/20"
      />
      <aside className="absolute right-0 top-0 h-full w-[470px] overflow-auto border-l border-slate-200 bg-white p-7 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-500">
            Product details
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>
        <div className="mb-7">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Package size={30} />
          </div>
          <div className="text-xl font-semibold text-slate-900">
            {product.name}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {product.brand} · {product.category}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Info label="SKU" value={product.sku} />
          <Info label="Barcode" value={product.barcode} />
          <Info label="Price" value={formatCurrency(product.price)} />
          <Info label="Cost" value={formatCurrency(product.cost)} />
        </div>
        <div className="my-6 rounded-xl border border-slate-200 p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Stock
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold text-slate-900">
                {product.stock}
              </div>
              <div className="text-sm text-slate-400">
                {product.unit} available
              </div>
            </div>
            <StockBadge
              stock={product.stock}
              minimum={product.minimumStock}
              unit={product.unit}
            />
          </div>
        </div>
        <div className="mb-6 rounded-xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MapPin size={14} /> Location
          </div>
          <div className="font-medium text-slate-800">
            {product.location.store}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            Aisle {product.location.aisle} · Rack {product.location.rack} ·
            Shelf {product.location.shelf}
          </div>
        </div>
        <button
          onClick={onReceive}
          className="mb-7 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <ArrowDownToLine size={17} /> Receive stock
        </button>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Recent movements</h3>
            <span className="text-xs text-slate-400">{movements.length}</span>
          </div>
          {movements.length === 0 ? (
            <div className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
              No movements yet.
            </div>
          ) : (
            movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between border-t border-slate-100 py-3"
              >
                <div>
                  <div className="text-sm font-medium text-slate-700">
                    {movementLabels[movement.type]}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDate(movement.createdAt)}
                  </div>
                </div>
                <div className="font-semibold text-slate-700">
                  {movementDelta(movement.type, movement.quantity) > 0
                    ? "+"
                    : "−"}
                  {movement.quantity}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-medium text-slate-700">
        {value}
      </div>
    </div>
  );
}

function ReceiveStockModal({
  products,
  onClose,
  onReceive,
}: {
  products: Product[];
  onClose: () => void;
  onReceive: (form: ReceiveForm, photo?: string) => void;
}) {
  const [form, setForm] = useState<ReceiveForm>(() => ({
    productId: products[0]?.id ?? "",
    quantity: "1",
    unitCost: products[0]?.cost.toString() ?? "",
    note: "",
    location: products[0]?.location ?? {
      store: "Principal",
      aisle: "A1",
      rack: "R1",
      shelf: "S1",
    },
  }));
  const product =
    products.find((item) => item.id === form.productId) ?? products[0];
  const [photo, setPhoto] = useState<string>();
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    if (product && form.productId === product.id)
      setForm((current) => ({
        ...current,
        unitCost: current.unitCost || product.cost.toString(),
        location: current.location ?? product.location,
      }));
  }, [product]);

  function changeProduct(id: string) {
    const next = products.find((item) => item.id === id);
    setForm((current) => ({
      ...current,
      productId: id,
      unitCost: next?.cost.toString() ?? current.unitCost,
      location: next?.location ?? current.location,
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-6">
      <div className="max-h-[92vh] w-[760px] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Receive stock
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">
              Record incoming inventory as a purchase movement.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>
        <div className="space-y-6 p-7">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product
            </label>
            <select
              value={form.productId}
              onChange={(event) => changeProduct(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            >
              {products.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.sku}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field
              label={`Quantity (${product?.unit ?? "unit"})`}
              value={form.quantity}
              type="number"
              min="1"
              onChange={(value) => setForm({ ...form, quantity: value })}
            />
            <Field
              label="Unit cost"
              value={form.unitCost}
              type="number"
              min="0"
              onChange={(value) => setForm({ ...form, unitCost: value })}
            />
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Current stock
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-800">
                {product?.stock ?? 0} {product?.unit}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">
                  Storage location
                </div>
                <div className="text-xs text-slate-400">
                  Where should this received stock be placed?
                </div>
              </div>
              <MapPin size={18} className="text-slate-400" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <Field
                label="Store"
                value={form.location.store}
                onChange={(value) =>
                  setForm({
                    ...form,
                    location: { ...form.location, store: value },
                  })
                }
              />
              <Field
                label="Aisle"
                value={form.location.aisle}
                onChange={(value) =>
                  setForm({
                    ...form,
                    location: { ...form.location, aisle: value },
                  })
                }
              />
              <Field
                label="Rack"
                value={form.location.rack}
                onChange={(value) =>
                  setForm({
                    ...form,
                    location: { ...form.location, rack: value },
                  })
                }
              />
              <Field
                label="Shelf"
                value={form.location.shelf}
                onChange={(value) =>
                  setForm({
                    ...form,
                    location: { ...form.location, shelf: value },
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product photo{" "}
              <span className="font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            {photo ? (
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-3">
                <img
                  src={photo}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-700">
                    Photo captured
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    It will be attached to the product in this prototype.
                  </div>
                </div>
                <button
                  onClick={() => setPhoto(undefined)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={17} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCameraOpen(true)}
                  className="flex h-24 items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  <Camera size={19} /> Take photo
                </button>
                <label className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100">
                  <ImagePlus size={19} /> Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) setPhoto(URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
            )}
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Note{" "}
              <span className="font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              value={form.note}
              onChange={(event) =>
                setForm({ ...form, note: event.target.value })
              }
              placeholder="e.g. Supplier delivery #1048"
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-7 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={!form.productId || Number(form.quantity) <= 0}
            onClick={() => onReceive(form, photo)}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={17} /> Receive stock
          </button>
        </div>
      </div>
      {cameraOpen && (
        <CameraCapture
          onClose={() => setCameraOpen(false)}
          onCapture={(value) => {
            setPhoto(value);
            setCameraOpen(false);
          }}
        />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-slate-500">{label}</span>
      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      />
    </label>
  );
}

function CameraCapture({
  onClose,
  onCapture,
}: {
  onClose: () => void;
  onCapture: (photo: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera access is not available in this webview.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (cause) {
        const name =
          cause instanceof DOMException ? cause.name : "UnknownError";
        setError(
          name === "NotAllowedError"
            ? "Camera permission was denied."
            : name === "NotFoundError"
              ? "No camera was found."
              : "Could not start the camera.",
        );
      }
    }
    void start();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    if (!video || !ready) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL("image/jpeg", 0.88));
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-6">
      <div className="w-[760px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="font-semibold text-slate-900">
              Take product photo
            </div>
            <div className="text-xs text-slate-400">
              Camera access is requested only while this window is open.
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="bg-slate-950 p-4">
          {error ? (
            <div className="flex h-[420px] items-center justify-center text-sm text-slate-300">
              {error}
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-[420px] w-full rounded-lg object-cover"
            />
          )}
        </div>
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600"
          >
            Cancel
          </button>
          <button
            disabled={!ready}
            onClick={capture}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            <Camera size={17} /> Capture
          </button>
        </div>
      </div>
    </div>
  );
}

function Placeholder({
  section,
}: {
  section: Exclude<Section, "products" | "inventory">;
}) {
  const copy: Record<typeof section, { title: string; body: string }> = {
    overview: {
      title: "Overview",
      body: "Dashboard metrics will be connected to inventory data in the next iteration.",
    },
    locations: {
      title: "Locations",
      body: "Physical store mapping will be added after the receiving workflow.",
    },
    alerts: {
      title: "Alerts",
      body: "Low-stock rules are represented in the inventory summary for now.",
    },
  };
  return (
    <div className="mx-auto flex max-w-[900px] items-center justify-center py-28">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
          <BarChart3 size={22} />
        </div>
        <h1 className="text-xl font-semibold text-slate-900">
          {copy[section].title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {copy[section].body}
        </p>
      </div>
    </div>
  );
}

export default App;
