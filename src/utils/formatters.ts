import type { ProductLocation, StockMovementType } from "../types/inventory";

export const movementClasses: Record<StockMovementType, string> = {
  PURCHASE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  SALE: "bg-slate-100 text-slate-700 ring-slate-200",
  RETURN: "bg-blue-50 text-blue-700 ring-blue-200",
  ADJUSTMENT: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function getActiveLocale(): string {
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("app_locale");
      if (saved) return saved;
    }
  } catch {
    // ignore
  }
  return "es";
}

export function formatCurrency(value: number, locale?: string): string {
  const active = locale || getActiveLocale();
  if (active === "en") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | Date | number, locale?: string): string {
  const active = locale || getActiveLocale();
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);

  if (active === "en") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function locationLabel(location: ProductLocation): string {
  return `${location.aisle} · ${location.rack} · ${location.shelf}`;
}

export function movementDelta(type: StockMovementType, quantity: number): number {
  return type === "PURCHASE" || type === "RETURN" ? quantity : -quantity;
}
