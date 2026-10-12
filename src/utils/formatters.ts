import type { ProductLocation, StockMovementType } from "../types/inventory";

export const movementLabels: Record<StockMovementType, string> = {
  PURCHASE: "Purchase",
  SALE: "Sale",
  RETURN: "Return",
  ADJUSTMENT: "Adjustment",
};

export const movementClasses: Record<StockMovementType, string> = {
  PURCHASE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  SALE: "bg-slate-100 text-slate-700 ring-slate-200",
  RETURN: "bg-blue-50 text-blue-700 ring-blue-200",
  ADJUSTMENT: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function locationLabel(location: ProductLocation): string {
  return `${location.aisle} · ${location.rack} · ${location.shelf}`;
}

export function movementDelta(type: StockMovementType, quantity: number): number {
  return type === "PURCHASE" || type === "RETURN" ? quantity : -quantity;
}
