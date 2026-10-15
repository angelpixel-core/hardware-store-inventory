import { useMemo, useState } from "react";
import type { Product } from "../../../types/inventory";
import { formatCurrency, locationLabel } from "../../../utils/formatters";
import type {
  AlertFilterSeverity,
  AlertsKPIs,
  InventoryAlert,
  PurchaseOrderDraft,
  PurchaseOrderItem,
} from "../types";

export function useAlertsState(products: Product[]) {
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] =
    useState<AlertFilterSeverity>("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedAlertIds, setSelectedAlertIds] = useState<Set<string>>(
    new Set(),
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // 1. Audit and generate inventory alerts
  const allAlerts: InventoryAlert[] = useMemo(() => {
    const list: InventoryAlert[] = [];

    for (const p of products) {
      const loc = locationLabel(p.location);

      if (p.stock === 0) {
        const targetStock = Math.max(p.minimumStock * 2, 5);
        const deficit = targetStock;
        list.push({
          id: `alert-${p.id}`,
          productId: p.id,
          product: p,
          severity: "CRITICAL",
          title: "Quiebre de stock total",
          message: "Artículo completamente agotado. Ventas en riesgo.",
          currentStock: 0,
          minimumStock: p.minimumStock,
          targetStock,
          deficit,
          unitCost: p.cost,
          estimatedCost: deficit * p.cost,
          suggestedReorderQuantity: deficit,
          locationLabel: loc,
        });
      } else if (p.stock <= p.minimumStock) {
        const targetStock = Math.max(p.minimumStock * 2, p.stock + 5);
        const deficit = Math.max(0, targetStock - p.stock);
        list.push({
          id: `alert-${p.id}`,
          productId: p.id,
          product: p,
          severity: "WARNING",
          title: "Bajo stock de seguridad",
          message: "Existencias por debajo o al límite del umbral mínimo de seguridad.",
          currentStock: p.stock,
          minimumStock: p.minimumStock,
          targetStock,
          deficit,
          unitCost: p.cost,
          estimatedCost: deficit * p.cost,
          suggestedReorderQuantity: deficit,
          locationLabel: loc,
        });
      } else if (p.stock > p.minimumStock * 4 && p.stock >= 20) {
        list.push({
          id: `alert-${p.id}`,
          productId: p.id,
          product: p,
          severity: "OVERSTOCK",
          title: "Sobrestock / Exceso",
          message: "Existencias 4x superiores al stock mínimo requerido. Capital inmovilizado.",
          currentStock: p.stock,
          minimumStock: p.minimumStock,
          targetStock: p.minimumStock * 2,
          deficit: 0,
          unitCost: p.cost,
          estimatedCost: 0,
          suggestedReorderQuantity: 0,
          locationLabel: loc,
        });
      }
    }

    // Sort: CRITICAL first, then WARNING, then OVERSTOCK
    const severityRank: Record<string, number> = {
      CRITICAL: 1,
      WARNING: 2,
      OVERSTOCK: 3,
    };

    return list.sort((a, b) => {
      const rankDiff = severityRank[a.severity] - severityRank[b.severity];
      if (rankDiff !== 0) return rankDiff;
      return b.estimatedCost - a.estimatedCost;
    });
  }, [products]);

  // 2. Computed KPIs
  const kpis: AlertsKPIs = useMemo(() => {
    let criticalCount = 0;
    let warningCount = 0;
    let overstockCount = 0;
    let totalReplenishmentCost = 0;

    for (const a of allAlerts) {
      if (a.severity === "CRITICAL") criticalCount++;
      else if (a.severity === "WARNING") warningCount++;
      else if (a.severity === "OVERSTOCK") overstockCount++;

      totalReplenishmentCost += a.estimatedCost;
    }

    return {
      totalAlerts: allAlerts.length,
      criticalCount,
      warningCount,
      overstockCount,
      totalReplenishmentCost,
    };
  }, [allAlerts]);

  // 3. Unique categories for filtering
  const categories = useMemo(() => {
    const set = new Set(allAlerts.map((a) => a.product.category));
    return Array.from(set).sort();
  }, [allAlerts]);

  // 4. Filtered Alerts
  const filteredAlerts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allAlerts.filter((a) => {
      // Filter severity
      if (selectedSeverity !== "ALL" && a.severity !== selectedSeverity) {
        return false;
      }
      // Filter category
      if (selectedCategory !== "ALL" && a.product.category !== selectedCategory) {
        return false;
      }
      // Filter search
      if (q) {
        const matchesName = a.product.name.toLowerCase().includes(q);
        const matchesSku = a.product.sku.toLowerCase().includes(q);
        const matchesBrand = a.product.brand.toLowerCase().includes(q);
        const matchesCategory = a.product.category.toLowerCase().includes(q);
        return matchesName || matchesSku || matchesBrand || matchesCategory;
      }
      return true;
    });
  }, [allAlerts, search, selectedSeverity, selectedCategory]);

  // 5. Selection Handlers
  function toggleSelectAlert(id: string) {
    setSelectedAlertIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectAllFiltered() {
    const allFilteredIds = filteredAlerts
      .filter((a) => a.severity !== "OVERSTOCK")
      .map((a) => a.id);
    setSelectedAlertIds(new Set(allFilteredIds));
  }

  function clearSelection() {
    setSelectedAlertIds(new Set());
  }

  // 6. Purchase Order Draft Derivation
  const purchaseOrderDraft: PurchaseOrderDraft = useMemo(() => {
    // If user has specific items selected, use them; otherwise use all reorderable items
    const targetAlerts =
      selectedAlertIds.size > 0
        ? allAlerts.filter((a) => selectedAlertIds.has(a.id))
        : allAlerts.filter(
            (a) => a.severity === "CRITICAL" || a.severity === "WARNING",
          );

    const items: PurchaseOrderItem[] = targetAlerts.map((a) => ({
      productId: a.productId,
      name: a.product.name,
      sku: a.product.sku,
      brand: a.product.brand,
      unit: a.product.unit,
      quantityToOrder: a.suggestedReorderQuantity,
      unitCost: a.unitCost,
      totalCost: a.estimatedCost,
    }));

    const totalUnits = items.reduce((acc, it) => acc + it.quantityToOrder, 0);
    const totalEstimatedCost = items.reduce((acc, it) => acc + it.totalCost, 0);

    return {
      items,
      totalItems: items.length,
      totalUnits,
      totalEstimatedCost,
    };
  }, [allAlerts, selectedAlertIds]);

  function exportOrderCsv() {
    if (purchaseOrderDraft.items.length === 0) return;

    const headers = [
      "SKU",
      "Producto",
      "Marca",
      "Unidad",
      "Cantidad Sugerida",
      "Costo Unitario",
      "Costo Total Estimado",
    ];
    const rows = purchaseOrderDraft.items.map((it) => [
      `"${it.sku}"`,
      `"${it.name.replace(/"/g, '""')}"`,
      `"${it.brand}"`,
      `"${it.unit}"`,
      it.quantityToOrder,
      it.unitCost,
      it.totalCost,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n",
    );
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `orden-compra-reposicion-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function copyOrderText(): boolean {
    if (purchaseOrderDraft.items.length === 0) return false;

    const lines = [
      `📦 ORDEN DE REPOSICIÓN - FERRETERÍA`,
      `Fecha: ${new Date().toLocaleDateString("es-AR")}`,
      `Total Artículos: ${purchaseOrderDraft.totalItems} | Unidades: ${purchaseOrderDraft.totalUnits}`,
      `Presupuesto Estimado: ${formatCurrency(purchaseOrderDraft.totalEstimatedCost)}`,
      `----------------------------------------`,
      ...purchaseOrderDraft.items.map(
        (it) =>
          `• [${it.sku}] ${it.name} (${it.brand}) -> Pedir: ${it.quantityToOrder} ${it.unit} (Costo est.: ${formatCurrency(it.totalCost)})`,
      ),
      `----------------------------------------`,
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    return true;
  }

  return {
    kpis,
    alerts: filteredAlerts,
    totalAlertsCount: allAlerts.length,
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
    openOrderModal: () => setIsOrderModalOpen(true),
    closeOrderModal: () => setIsOrderModalOpen(false),
    purchaseOrderDraft,
    exportOrderCsv,
    copyOrderText,
  };
}
