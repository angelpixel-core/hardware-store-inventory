import { Check, ChevronDown, X } from "lucide-react";
import { CameraCapture } from "../../components/media";
import { Field } from "../../components/ui";
import { useTranslation } from "../../i18n";
import { PhotoAttachment, PlacementFields } from "./components";
import { useStockIntakeForm } from "./hooks";
import type { ReceiveStockModalProps } from "./types";

export function ReceiveStockModal({
  products,
  selectedProductId,
  onClose,
  onSubmit,
}: ReceiveStockModalProps) {
  const { t } = useTranslation();
  const {
    form,
    setForm,
    activeProduct,
    photo,
    setPhoto,
    cameraOpen,
    setCameraOpen,
    handleProductChange,
    handleFileChange,
    handleSubmit,
  } = useStockIntakeForm({
    products,
    selectedProductId,
    onSubmit,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {t.stockIntake.title}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {t.stockIntake.subtitle}
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
            <span className="mb-1.5 block text-xs text-slate-500">{t.stockIntake.selectProduct}</span>
            <div className="relative">
              <select
                value={form.productId}
                onChange={(event) => handleProductChange(event.target.value)}
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
              label={`${t.stockIntake.quantity} (${activeProduct?.unit ?? "units"})`}
              type="number"
              min="1"
              value={form.quantity}
              onChange={(value) =>
                setForm((current) => ({ ...current, quantity: value }))
              }
            />
            <Field
              label={t.stockIntake.unitCost}
              type="number"
              value={form.unitCost}
              onChange={(value) =>
                setForm((current) => ({ ...current, unitCost: value }))
              }
            />
          </div>

          <PlacementFields
            location={form.location}
            onChange={(location) =>
              setForm((current) => ({ ...current, location }))
            }
          />

          <Field
            label={t.stockIntake.deliveryNote}
            value={form.note}
            onChange={(value) =>
              setForm((current) => ({ ...current, note: value }))
            }
          />

          <PhotoAttachment
            photo={photo}
            onClearPhoto={() => setPhoto(undefined)}
            onFileChange={handleFileChange}
            onRequestCamera={() => setCameraOpen(true)}
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            {t.stockIntake.cancelBtn}
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            <Check size={17} /> {t.stockIntake.submitBtn}
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
