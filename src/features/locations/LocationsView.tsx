import {
  LocationsSummaryCards,
  PickingSearchBar,
  RelocateProductModal,
  ShelfContentsList,
  StoreLayoutMap,
} from "./components";
import { useLocationsState } from "./hooks";
import type { LocationsViewProps } from "./types";

export function LocationsView({
  products,
  onSelectProduct,
  onReceive,
  onRelocateProduct,
}: LocationsViewProps) {
  const {
    aisles,
    kpis,
    activeRacks,
    scopedProducts,
    selectedAisleId,
    setSelectedAisleId,
    selectedRackId,
    setSelectedRackId,
    pickingQuery,
    setPickingQuery,
    pickingMatches,
    handleSelectPickingMatch,
    productToRelocate,
    isRelocateOpen,
    openRelocate,
    closeRelocate,
    handleRelocate,
  } = useLocationsState(products, onRelocateProduct);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Mapeo Físico de Tienda y Pasillos
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Distribución espacial de estanterías, zonificación y modo picking de mostrador.
        </p>
      </div>

      {/* Picking / Counter Quick Search */}
      <PickingSearchBar
        query={pickingQuery}
        onQueryChange={setPickingQuery}
        matches={pickingMatches}
        onSelectMatch={handleSelectPickingMatch}
      />

      {/* Spatial KPIs */}
      <LocationsSummaryCards kpis={kpis} />

      {/* Interactive Store Layout Map */}
      <StoreLayoutMap
        aisles={aisles}
        selectedAisleId={selectedAisleId}
        onSelectAisle={setSelectedAisleId}
        activeRacks={activeRacks}
        selectedRackId={selectedRackId}
        onSelectRack={setSelectedRackId}
      />

      {/* Shelf / Aisle Contents List */}
      <ShelfContentsList
        products={scopedProducts}
        selectedAisleId={selectedAisleId}
        selectedRackId={selectedRackId}
        onSelectProduct={onSelectProduct}
        onReceive={(id) => onReceive(id)}
        onOpenRelocate={openRelocate}
      />

      {/* Relocation Modal */}
      <RelocateProductModal
        isOpen={isRelocateOpen}
        product={productToRelocate}
        onClose={closeRelocate}
        onConfirm={handleRelocate}
      />
    </div>
  );
}
