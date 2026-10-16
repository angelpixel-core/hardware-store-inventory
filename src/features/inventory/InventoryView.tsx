import { Plus, Scale } from "lucide-react";
import { useState, useMemo } from "react";
import {
  MetricsCards,
  MovementLedger,
  StockAdjustmentModal,
  KardexFiltersBar,
  type KardexFilterType,
} from "./components";
import type { Product, StockMovement } from "../../types/inventory";
import type { AdjustStockInput } from "../../hooks/useInventoryState";
import { movementDelta, locationLabel, formatDate } from "../../utils/formatters";

export interface InventoryViewProps {
  products: Product[];
  movements: StockMovement[];
  onReceive: () => void;
  onAdjustStock?: (input: AdjustStockInput) => void;
}

export function InventoryView({
  products,
  movements,
  onReceive,
  onAdjustStock,
}: InventoryViewProps) {
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<KardexFilterType>("ALL");

  const totalUnits = products.reduce((acc, item) => acc + item.stock, 0);
  const lowStockCount = products.filter(
    (item) => item.stock <= item.minimumStock,
  ).length;

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      // Type filter
      if (selectedType !== "ALL" && m.type !== selectedType) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const term = search.toLowerCase();
        const prod = productMap.get(m.productId);
        const nameMatch = prod?.name.toLowerCase().includes(term);
        const skuMatch = prod?.sku.toLowerCase().includes(term);
        const noteMatch = m.note?.toLowerCase().includes(term);
        const typeMatch = m.type.toLowerCase().includes(term);
        if (!nameMatch && !skuMatch && !noteMatch && !typeMatch) {
          return false;
        }
      }

      return true;
    });
  }, [movements, selectedType, search, productMap]);

  function exportKardexCsv() {
    if (filteredMovements.length === 0) return;

    const headers = [
      "ID Movimiento",
      "Fecha",
      "SKU",
      "Producto",
      "Tipo",
      "Variación (Delta)",
      "Unidad",
      "Ubicación",
      "Nota / Motivo",
    ];

    const rows = filteredMovements.map((m) => {
      const prod = productMap.get(m.productId);
      const delta = movementDelta(m.type, m.quantity);
      return [
        `"${m.id}"`,
        `"${formatDate(m.createdAt)}"`,
        `"${prod?.sku || ""}"`,
        `"${(prod?.name || m.productId).replace(/"/g, '""')}"`,
        `"${m.type}"`,
        delta > 0 ? `+${delta}` : delta,
        `"${prod?.unit || "un"}"`,
        `"${locationLabel(m.location)}"`,
        `"${(m.note || "").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `kardex-movimientos-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Kardex e Inventario Físico
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Libro mayor de transacciones, auditoría de existencias y registro de mermas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdjustmentOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 shadow-2xs transition hover:bg-amber-100 hover:border-amber-400"
          >
            <Scale size={15} /> + Ajustar Stock (Auditoría/Mermas)
          </button>
          <button
            onClick={onReceive}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
          >
            <Plus size={15} /> Recepción de stock
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards
        totalUnits={totalUnits}
        productCount={products.length}
        lowStockCount={lowStockCount}
      />

      {/* Kardex Filters Bar */}
      <KardexFiltersBar
        search={search}
        onSearchChange={setSearch}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onExportCsv={exportKardexCsv}
        totalFilteredCount={filteredMovements.length}
      />

      {/* Movement Ledger */}
      <MovementLedger movements={filteredMovements} products={products} />

      {/* Stock Adjustment Modal */}
      {isAdjustmentOpen && (
        <StockAdjustmentModal
          isOpen={isAdjustmentOpen}
          products={products}
          onClose={() => setIsAdjustmentOpen(false)}
          onSubmit={(input) => {
            onAdjustStock?.(input);
          }}
        />
      )}
    </div>
  );
}

