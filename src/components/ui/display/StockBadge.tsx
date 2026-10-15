export interface StockBadgeProps {
  stock: number;
  minimum: number;
  unit: string;
}

export function StockBadge({ stock, minimum, unit }: StockBadgeProps) {
  const low = stock <= minimum;
  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        low
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-emerald-50 text-emerald-700 ring-emerald-200"
      }`}
    >
      {stock} {unit}
      {low ? " · Low" : ""}
    </span>
  );
}
