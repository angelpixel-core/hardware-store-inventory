import { useMemo } from "react";
import type { Product, StockMovement } from "../../../types/inventory";
import { locationLabel } from "../../../utils/formatters";
import type {
  CategoryDistribution,
  CriticalProduct,
  MovementTrendPoint,
  OverviewKPIs,
  OverviewMetricsHookResult,
} from "../types";

export function useOverviewMetrics(
  products: Product[],
  movements: StockMovement[],
): OverviewMetricsHookResult {
  return useMemo(() => {
    // 1. Executive KPIs
    let totalInventoryCost = 0;
    let totalInventoryValue = 0;
    let totalUnits = 0;
    let outOfStockCount = 0;
    let lowStockCount = 0;

    const categoryMap = new Map<
      string,
      { productCount: number; totalUnits: number; totalCost: number; totalValue: number }
    >();

    for (const p of products) {
      const units = Math.max(0, p.stock);
      const costTotal = units * p.cost;
      const valueTotal = units * p.price;

      totalInventoryCost += costTotal;
      totalInventoryValue += valueTotal;
      totalUnits += units;

      if (units === 0) {
        outOfStockCount++;
      } else if (units <= p.minimumStock) {
        lowStockCount++;
      }

      const cat = p.category || "General";
      const existing = categoryMap.get(cat) ?? {
        productCount: 0,
        totalUnits: 0,
        totalCost: 0,
        totalValue: 0,
      };

      existing.productCount += 1;
      existing.totalUnits += units;
      existing.totalCost += costTotal;
      existing.totalValue += valueTotal;
      categoryMap.set(cat, existing);
    }

    const projectedProfit = Math.max(0, totalInventoryValue - totalInventoryCost);
    const projectedMarginPercent =
      totalInventoryValue > 0
        ? Math.round((projectedProfit / totalInventoryValue) * 1000) / 10
        : 0;

    const kpis: OverviewKPIs = {
      totalInventoryCost,
      totalInventoryValue,
      projectedProfit,
      projectedMarginPercent,
      totalUnits,
      totalSkus: products.length,
      outOfStockCount,
      lowStockCount,
    };

    // 2. Category Distribution
    const categoryDistribution: CategoryDistribution[] = Array.from(
      categoryMap.entries(),
    )
      .map(([category, stats]) => ({
        category,
        productCount: stats.productCount,
        totalUnits: stats.totalUnits,
        totalCost: stats.totalCost,
        totalValue: stats.totalValue,
        percentOfUnits:
          totalUnits > 0
            ? Math.round((stats.totalUnits / totalUnits) * 1000) / 10
            : 0,
      }))
      .sort((a, b) => b.totalUnits - a.totalUnits);

    // 3. Movement Trends (Chronological flow points for charts)
    const dateMap = new Map<
      string,
      { purchases: number; sales: number; adjustments: number; totalVolume: number }
    >();

    // Process movements into date buckets
    const sortedMovements = [...movements].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    for (const mov of sortedMovements) {
      const dateKey = mov.createdAt.split("T")[0] || "Hoy";
      const bucket = dateMap.get(dateKey) ?? {
        purchases: 0,
        sales: 0,
        adjustments: 0,
        totalVolume: 0,
      };

      const qty = Math.abs(mov.quantity);
      bucket.totalVolume += qty;

      if (mov.type === "PURCHASE" || mov.type === "RETURN") {
        bucket.purchases += qty;
      } else if (mov.type === "SALE") {
        bucket.sales += qty;
      } else {
        bucket.adjustments += qty;
      }

      dateMap.set(dateKey, bucket);
    }

    const movementTrends: MovementTrendPoint[] = Array.from(dateMap.entries())
      .slice(-7)
      .map(([date, counts]) => {
        const parts = date.split("-");
        const label =
          parts.length === 3 ? `${parts[2]}/${parts[1]}` : date;
        return {
          date,
          label,
          purchases: counts.purchases,
          sales: counts.sales,
          adjustments: counts.adjustments,
          totalVolume: counts.totalVolume,
        };
      });

    // 4. Critical Products
    const criticalProducts: CriticalProduct[] = products
      .filter((p) => p.stock <= p.minimumStock)
      .map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        sku: p.sku,
        category: p.category,
        stock: p.stock,
        minimumStock: p.minimumStock,
        deficit: Math.max(0, p.minimumStock - p.stock),
        locationLabel: locationLabel(p.location),
        status: (p.stock === 0 ? "OUT_OF_STOCK" : "LOW_STOCK") as
          | "OUT_OF_STOCK"
          | "LOW_STOCK",
      }))
      .sort((a, b) => {
        // Out of stock first, then by highest deficit
        if (a.status === "OUT_OF_STOCK" && b.status !== "OUT_OF_STOCK") return -1;
        if (a.status !== "OUT_OF_STOCK" && b.status === "OUT_OF_STOCK") return 1;
        return b.deficit - a.deficit;
      })
      .slice(0, 5);

    // 5. Recent Movements
    const recentMovements = movements.slice(0, 5);

    return {
      kpis,
      categoryDistribution,
      movementTrends,
      criticalProducts,
      recentMovements,
    };
  }, [products, movements]);
}
