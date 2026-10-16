import {
  AlertsFiltersBar,
  AlertsSummaryCards,
  AlertsTable,
  PurchaseOrderModal,
} from "./components";
import { useAlertsState } from "./hooks";
import type { AlertsViewProps } from "./types";

export function AlertsView({
  products,
  onSelectProduct,
  onReceive,
}: AlertsViewProps) {
  const {
    kpis,
    alerts,
    search,
    setSearch,
    selectedSeverity,
    setSelectedSeverity,
    selectedCategory,
    setSelectedCategory,
    categories,
    selectedAlertIds,
    toggleSelectAlert,
    selectAllFiltered,
    clearSelection,
    isOrderModalOpen,
    openOrderModal,
    closeOrderModal,
    purchaseOrderDraft,
    exportOrderCsv,
    copyOrderText,
  } = useAlertsState(products);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Centro de Alertas y Reabastecimiento
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Detección automática de quiebres, niveles mínimos de seguridad y asistente de órdenes de compra.
        </p>
      </div>

      {/* KPI Cards */}
      <AlertsSummaryCards
        kpis={kpis}
        onFilterSeverity={(sev) => setSelectedSeverity(sev)}
      />

      {/* Filter and Action Bar */}
      <AlertsFiltersBar
        search={search}
        onSearchChange={setSearch}
        selectedSeverity={selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        kpis={kpis}
        selectedCount={selectedAlertIds.size}
        onOpenOrderModal={openOrderModal}
        onSelectAll={selectAllFiltered}
        onClearSelection={clearSelection}
      />

      {/* Actionable Alerts Table */}
      <AlertsTable
        alerts={alerts}
        selectedAlertIds={selectedAlertIds}
        onToggleSelect={toggleSelectAlert}
        onSelectProduct={onSelectProduct}
        onReceive={onReceive}
      />

      {/* Purchase Order Assistant Modal */}
      <PurchaseOrderModal
        isOpen={isOrderModalOpen}
        onClose={closeOrderModal}
        draft={purchaseOrderDraft}
        onExportCsv={exportOrderCsv}
        onCopyText={copyOrderText}
      />
    </div>
  );
}
