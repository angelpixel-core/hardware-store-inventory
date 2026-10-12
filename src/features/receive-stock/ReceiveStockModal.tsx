import { useEffect, useState } from "react";
import { Camera, Check, ChevronDown, ImagePlus, X } from "lucide-react";
import { Field } from "../../components/ui";
import { CameraCapture } from "./CameraCapture";
import type { Product, ProductLocation } from "../../types/inventory";

export interface ReceiveForm {
  productId: string;
  quantity: string;
  unitCost: string;
  note: string;
  location: ProductLocation;
}

export interface ReceiveStockModalProps {
  products: Product[];
  selectedProductId: string | null;
  onClose: () => void;
  onSubmit: (params: {
    productId: string;
    quantity: number;
    unitCost?: number;
    note?: string;
    location: ProductLocation;
    photo?: string;
  }) => void;
}

export function ReceiveStockModal({
  products,
  selectedProductId,
  onClose,
  onSubmit,
}: ReceiveStockModalProps) {
  const [form, setForm] = useState<ReceiveForm>(() => ({
    productId: selectedProductId ?? products[0]?.id ?? "",
    quantity: "1",
    unitCost: (
      products.find((p) => p.id === selectedProductId)?.cost ??
      products[0]?.cost ??
      0
    ).toString(),
    note: "",
    location: (
      products.find((p) => p.id === selectedProductId)?.location ??
      products[0]?.location ?? {
        store: "Principal",
        aisle: "A1",
        rack: "R1",
        shelf: "S1",
      }
    ),
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
        location: product.location,
      }));
  }, [product, form.productId]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    const qty = parseInt(form.quantity, 10);
    if (!qty || qty <= 0) return;
    onSubmit({
      productId: form.productId,
      quantity: qty,
      unitCost: form.unitCost ? parseFloat(form.unitCost) : undefined,
      note: form.note || undefined,
      location: form.location,
      photo,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Receive Stock
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Record incoming shipment and update current store placement.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-500">Product</span>
            <div className="relative">
              <select
                value={form.productId}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    productId: event.target.value,
                  }))
                }
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm outline-none focus:border-slate-400"
              >
                {products.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku}) — stock: {item.stock} {item.unit}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label={`Quantity (${product?.unit ?? "units"})`}
              type="number"
              min="1"
              value={form.quantity}
              onChange={(value) =>
                setForm((current) => ({ ...current, quantity: value }))
              }
            />
            <Field
              label="Unit Cost (ARS)"
              type="number"
              value={form.unitCost}
              onChange={(value) =>
                setForm((current) => ({ ...current, unitCost: value }))
              }
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Store Placement
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Field
                label="Aisle"
                value={form.location.aisle}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    location: { ...current.location, aisle: value },
                  }))
                }
              />
              <Field
                label="Rack"
                value={form.location.rack}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    location: { ...current.location, rack: value },
                  }))
                }
              />
              <Field
                label="Shelf"
                value={form.location.shelf}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    location: { ...current.location, shelf: value },
                  }))
                }
              />
            </div>
          </div>

          <Field
            label="Delivery / Supplier Note (optional)"
            value={form.note}
            onChange={(value) =>
              setForm((current) => ({ ...current, note: value }))
            }
          />

          <div>
            <span className="mb-1.5 block text-xs text-slate-500">
              Product / Shipment Photo (optional)
            </span>
            {photo ? (
              <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200">
                <img
                  src={photo}
                  alt="Snapshot"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhoto(undefined)}
                  className="absolute right-2 top-2 rounded-full bg-slate-900/70 p-1 text-white hover:bg-slate-900"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                  <ImagePlus size={16} /> Upload photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setCameraOpen(true)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Camera size={16} /> Take photo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
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
