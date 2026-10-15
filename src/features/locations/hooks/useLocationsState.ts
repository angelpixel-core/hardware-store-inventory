import { useMemo, useState } from "react";
import type { Product, ProductLocation } from "../../../types/inventory";
import { locationLabel } from "../../../utils/formatters";
import type {
  AisleInfo,
  LocationsKPIs,
  PickingMatch,
  RackInfo,
  ShelfInfo,
} from "../types";

const AISLE_METADATA: Record<string, { category: string; description: string }> = {
  A1: {
    category: "Herramientas eléctricas",
    description: "Maquinaria de corte, taladros, amoladoras y accesorios de potencia.",
  },
  A2: {
    category: "Herramientas manuales",
    description: "Llaves, destornilladores, martillos, pinzas y cajas portaherramientas.",
  },
  A3: {
    category: "Fijaciones y tornillería",
    description: "Bulonería métrica, tirafondos, tarugos, clavos y gaveteros de precisión.",
  },
  A4: {
    category: "Plomería y grifería",
    description: "Conexiones termofusión, caños, llaves de paso, válvulas y selladores.",
  },
  A5: {
    category: "Electricidad e iluminación",
    description: "Cables unipolar, llaves térmicas, disyuntores, lámparas LED y tomas.",
  },
  A6: {
    category: "Pinturas y adhesivos",
    description: "Látex interior/exterior, esmaltes sintéticos, pinceles, rodillos y cintas.",
  },
  A7: {
    category: "Construcción y corralón",
    description: "Cemento, adhesivos para cerámicos, mallas metálicas y materiales áridos.",
  },
};

export function useLocationsState(
  products: Product[],
  onRelocateProduct?: (productId: string, newLocation: ProductLocation) => void,
) {
  // Navigation & Selection state
  const [selectedAisleId, setSelectedAisleId] = useState<string>("A1");
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);

  // Picking search state
  const [pickingQuery, setPickingQuery] = useState("");

  // Relocation modal state
  const [productToRelocate, setProductToRelocate] = useState<Product | null>(null);
  const [isRelocateOpen, setIsRelocateOpen] = useState(false);

  // 1. Process spatial hierarchy: Store -> Aisles -> Racks -> Shelves
  const { aisles, kpis, racksByAisle, shelvesByRack } = useMemo(() => {
    const aisleMap = new Map<string, Product[]>();
    const rackSet = new Set<string>();
    const shelfSet = new Set<string>();
    let totalUnits = 0;

    // Initialize all standard aisles (A1 to A7)
    for (let i = 1; i <= 7; i++) {
      aisleMap.set(`A${i}`, []);
    }

    // Populate products into aisles and track coordinates
    for (const p of products) {
      const aisle = p.location.aisle || "A1";
      const rack = p.location.rack || "R1";
      const shelf = p.location.shelf || "S1";

      rackSet.add(`${aisle}-${rack}`);
      shelfSet.add(`${aisle}-${rack}-${shelf}`);
      totalUnits += Math.max(0, p.stock);

      const list = aisleMap.get(aisle) ?? [];
      list.push(p);
      aisleMap.set(aisle, list);
    }

    // Build AisleInfo list
    const aisleList: AisleInfo[] = Array.from(aisleMap.entries()).map(
      ([id, items]) => {
        const meta = AISLE_METADATA[id] ?? {
          category: items[0]?.category || "General",
          description: "Sector de almacenamiento general de artículos.",
        };

        const uniqueRacks = new Set(items.map((i) => i.location.rack)).size;
        const uniqueShelves = new Set(
          items.map((i) => `${i.location.rack}-${i.location.shelf}`),
        ).size;
        const aisleUnits = items.reduce((acc, i) => acc + Math.max(0, i.stock), 0);

        return {
          id,
          name: `Pasillo ${id}`,
          category: meta.category,
          description: meta.description,
          productCount: items.length,
          totalUnits: aisleUnits,
          racksCount: Math.max(uniqueRacks, items.length > 0 ? 1 : 0),
          shelvesCount: Math.max(uniqueShelves, items.length > 0 ? 1 : 0),
          products: items,
        };
      },
    );

    // Build Racks by Aisle
    const racksMap = new Map<string, RackInfo[]>();
    for (const aisle of aisleList) {
      const rackGroup = new Map<string, Product[]>();
      for (const p of aisle.products) {
        const rId = p.location.rack || "R1";
        const rList = rackGroup.get(rId) ?? [];
        rList.push(p);
        rackGroup.set(rId, rList);
      }

      const rackList: RackInfo[] = Array.from(rackGroup.entries()).map(
        ([rId, rProducts]) => ({
          id: rId,
          aisleId: aisle.id,
          name: `Rack ${rId}`,
          productCount: rProducts.length,
          totalUnits: rProducts.reduce((acc, p) => acc + Math.max(0, p.stock), 0),
          shelvesCount: new Set(rProducts.map((p) => p.location.shelf)).size,
          products: rProducts,
        }),
      );

      racksMap.set(aisle.id, rackList);
    }

    // Build Shelves by Rack
    const shelvesMap = new Map<string, ShelfInfo[]>();
    for (const p of products) {
      const aisle = p.location.aisle || "A1";
      const rack = p.location.rack || "R1";
      const shelf = p.location.shelf || "S1";
      const key = `${aisle}-${rack}`;

      const currentShelves = shelvesMap.get(key) ?? [];
      let shelfInfo = currentShelves.find((s) => s.id === shelf);
      if (!shelfInfo) {
        shelfInfo = {
          id: shelf,
          rackId: rack,
          aisleId: aisle,
          name: `Estante ${shelf}`,
          productCount: 0,
          totalUnits: 0,
          products: [],
        };
        currentShelves.push(shelfInfo);
        shelvesMap.set(key, currentShelves);
      }

      shelfInfo.productCount += 1;
      shelfInfo.totalUnits += Math.max(0, p.stock);
      shelfInfo.products.push(p);
    }

    const kpiData: LocationsKPIs = {
      totalAisles: aisleList.length,
      totalRacks: rackSet.size || 7,
      totalShelves: shelfSet.size || 15,
      assignedProducts: products.length,
      totalUnitsStored: totalUnits,
    };

    return {
      aisles: aisleList,
      kpis: kpiData,
      racksByAisle: racksMap,
      shelvesByRack: shelvesMap,
    };
  }, [products]);

  // 2. Active aisle and its content
  const activeAisle = useMemo(
    () => aisles.find((a) => a.id === selectedAisleId) ?? aisles[0],
    [aisles, selectedAisleId],
  );

  const activeRacks = useMemo(
    () => (activeAisle ? racksByAisle.get(activeAisle.id) ?? [] : []),
    [activeAisle, racksByAisle],
  );

  // Products in the currently selected scope (Aisle, Rack, or Shelf)
  const scopedProducts = useMemo(() => {
    if (!activeAisle) return [];
    let list = activeAisle.products;

    if (selectedRackId) {
      list = list.filter((p) => p.location.rack === selectedRackId);
    }
    if (selectedShelfId) {
      list = list.filter((p) => p.location.shelf === selectedShelfId);
    }

    return list;
  }, [activeAisle, selectedRackId, selectedShelfId]);

  // 3. Picking search matches
  const pickingMatches: PickingMatch[] = useMemo(() => {
    const q = pickingQuery.trim().toLowerCase();
    if (!q) return [];

    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode.includes(q) ||
          p.brand.toLowerCase().includes(q),
      )
      .slice(0, 5)
      .map((p) => ({
        product: p,
        location: p.location,
        locationLabel: locationLabel(p.location),
        inStock: p.stock > 0,
      }));
  }, [products, pickingQuery]);

  // Select a match to locate it immediately in the map
  function handleSelectPickingMatch(match: PickingMatch) {
    setSelectedAisleId(match.location.aisle);
    setSelectedRackId(match.location.rack);
    setSelectedShelfId(match.location.shelf);
    setPickingQuery("");
  }

  // Relocation workflow
  function openRelocate(product: Product) {
    setProductToRelocate(product);
    setIsRelocateOpen(true);
  }

  function closeRelocate() {
    setProductToRelocate(null);
    setIsRelocateOpen(false);
  }

  function handleRelocate(newLocation: ProductLocation) {
    if (productToRelocate && onRelocateProduct) {
      onRelocateProduct(productToRelocate.id, newLocation);
    }
    closeRelocate();
  }

  return {
    aisles,
    kpis,
    activeAisle,
    activeRacks,
    scopedProducts,
    selectedAisleId,
    setSelectedAisleId: (id: string) => {
      setSelectedAisleId(id);
      setSelectedRackId(null);
      setSelectedShelfId(null);
    },
    selectedRackId,
    setSelectedRackId,
    selectedShelfId,
    setSelectedShelfId,
    pickingQuery,
    setPickingQuery,
    pickingMatches,
    handleSelectPickingMatch,
    productToRelocate,
    isRelocateOpen,
    openRelocate,
    closeRelocate,
    handleRelocate,
  };
}
