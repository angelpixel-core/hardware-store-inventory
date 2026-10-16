import { Plus } from "lucide-react";
import {
  CategoryBreakdown,
  MovementTrendsChart,
  OverviewMetrics,
  RecentActivityFeed,
  UrgentReorderList,
} from "./components";
import { useOverviewMetrics } from "./hooks";
import type { OverviewViewProps } from "./types";

export function OverviewView({
  products,
  movements,
  onNavigateSection,
  onSelectProduct,
  onReceive,
}: OverviewViewProps) {
  const {
    kpis,
    categoryDistribution,
    movementTrends,
    criticalProducts,
    recentMovements,
  } = useOverviewMetrics(products, movements);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Dashboard General
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Visión ejecutiva del inventario, valuación económica y salud de stock en tiempo real.
          </p>
        </div>
        <button
          onClick={() => onReceive()}
          className="flex items-center gap-2 self-start rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={15} /> Receive stock
        </button>
      </div>

      {/* KPI Cards Grid */}
      <OverviewMetrics
        kpis={kpis}
        onNavigateSection={onNavigateSection}
      />

      {/* Charts & Interactive Panels Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Movement Trends Chart & Urgent Reorder List */}
        <div className="space-y-6 lg:col-span-7">
          <MovementTrendsChart
            data={movementTrends}
            onViewInventory={() => onNavigateSection("inventory")}
          />

          <UrgentReorderList
            products={criticalProducts}
            onSelectProduct={onSelectProduct}
            onReceive={onReceive}
            onViewAllAlerts={() => onNavigateSection("alerts")}
          />
        </div>

        {/* Right Column: Category Breakdown & Recent Activity */}
        <div className="space-y-6 lg:col-span-5">
          <CategoryBreakdown categories={categoryDistribution} />

          <RecentActivityFeed
            movements={recentMovements}
            products={products}
            onViewInventory={() => onNavigateSection("inventory")}
          />
        </div>
      </div>
    </div>
  );
}
