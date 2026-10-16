import { MapPin, Plus } from "lucide-react";
import { Info, StockBadge } from "../../../components/ui";
import { useTranslation } from "../../../i18n";
import { formatCurrency, locationLabel } from "../../../utils/formatters";
import type { Product } from "../../../types/inventory";

export interface ProductInfoGridProps {
  product: Product;
  onReceive: (productId: string) => void;
}

export function ProductInfoGrid({ product, onReceive }: ProductInfoGridProps) {
  const { t } = useTranslation();
  const margin = Math.round(
    ((product.price - product.cost) / product.price) * 100,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Info label={t.common.sku} value={product.sku} />
        <Info label="Barcode" value={product.barcode} />
        <Info label={t.common.price} value={formatCurrency(product.price)} />
        <Info label={t.common.cost} value={formatCurrency(product.cost)} />
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">{t.catalog.table.stock}</div>
            <div className="mt-1 flex items-center gap-2">
              <StockBadge
                stock={product.stock}
                minimum={product.minimumStock}
                unit={product.unit}
              />
              <span className="text-xs text-slate-400">
                min: {product.minimumStock} {product.unit}
              </span>
            </div>
          </div>
          <button
            onClick={() => onReceive(product.id)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
          >
            <Plus size={14} /> {t.productDetail.quickReceiveBtn}
          </button>
        </div>
        <div className="mt-3 text-[11px] text-slate-400">
          {t.common.margin}: <span className="font-medium text-slate-700">{margin}%</span>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
        <MapPin size={16} className="mt-0.5 text-slate-400 shrink-0" />
        <div className="text-xs">
          <div className="font-medium text-slate-700">{t.common.location}</div>
          <div className="mt-0.5 font-mono text-slate-500">
            {product.location.store} · {locationLabel(product.location)}
          </div>
        </div>
      </div>
    </div>
  );
}
