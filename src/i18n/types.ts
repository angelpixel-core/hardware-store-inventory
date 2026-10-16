export type Locale = "es" | "en";

export interface TranslationSchema {
  nav: {
    overview: string;
    products: string;
    inventory: string;
    locations: string;
    alerts: string;
    settings: string;
    appName: string;
    appSubtitle: string;
    backupDb: string;
    backupDbTitle: string;
  };
  common: {
    cancel: string;
    save: string;
    search: string;
    actions: string;
    loading: string;
    close: string;
    confirm: string;
    filter: string;
    clear: string;
    delete: string;
    edit: string;
    all: string;
    units: string;
    sku: string;
    price: string;
    cost: string;
    margin: string;
    location: string;
    category: string;
    brand: string;
    name: string;
    status: string;
    notes: string;
    date: string;
    quantity: string;
    success: string;
    error: string;
  };
  movementTypes: {
    PURCHASE: string;
    SALE: string;
    RETURN: string;
    ADJUSTMENT: string;
  };
  stockStatus: {
    normal: string;
    lowStock: string;
    outOfStock: string;
    overstock: string;
  };
  overview: {
    title: string;
    subtitle: string;
    metrics: {
      totalProducts: string;
      totalStockUnits: string;
      inventoryValuation: string;
      criticalAlerts: string;
      activeAisles: string;
    };
    charts: {
      flowTitle: string;
      flowSubtitle: string;
      inbound: string;
      outbound: string;
      categoryTitle: string;
      categorySubtitle: string;
    };
    urgent: {
      title: string;
      subtitle: string;
      receiveBtn: string;
      noUrgent: string;
    };
    activity: {
      title: string;
      subtitle: string;
      noActivity: string;
    };
  };
  catalog: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    newProductBtn: string;
    receiveStockBtn: string;
    table: {
      product: string;
      categoryBrand: string;
      stock: string;
      cost: string;
      price: string;
      margin: string;
      location: string;
      actions: string;
    };
    emptyState: string;
  };
  createProduct: {
    title: string;
    subtitle: string;
    fields: {
      name: string;
      namePlaceholder: string;
      brand: string;
      brandPlaceholder: string;
      category: string;
      sku: string;
      skuPlaceholder: string;
      barcode: string;
      barcodePlaceholder: string;
      description: string;
      cost: string;
      price: string;
      stock: string;
      minStock: string;
      unit: string;
      aisle: string;
      shelf: string;
      level: string;
    };
    marginPreview: string;
    markupPreview: string;
    submitBtn: string;
    cancelBtn: string;
  };
  productDetail: {
    drawerTitle: string;
    specsTitle: string;
    marginBreakdownTitle: string;
    profitPerUnit: string;
    markup: string;
    quickReceiveBtn: string;
    movementHistoryTitle: string;
    noMovements: string;
  };
  inventory: {
    title: string;
    subtitle: string;
    adjustStockBtn: string;
    receiveStockBtn: string;
    kpis: {
      totalUnits: string;
      activeProducts: string;
      lowStockCount: string;
    };
    filters: {
      searchPlaceholder: string;
      allTypes: string;
      exportCsvBtn: string;
      totalFiltered: string;
    };
    table: {
      id: string;
      date: string;
      product: string;
      type: string;
      variation: string;
      location: string;
      note: string;
    };
  };
  stockAdjustment: {
    title: string;
    subtitle: string;
    selectProduct: string;
    reasons: {
      title: string;
      DAMAGE: string;
      SHRINKAGE: string;
      PHYSICAL_AUDIT: string;
      OTHER: string;
    };
    currentStock: string;
    newStock: string;
    variation: string;
    notesPlaceholder: string;
    submitBtn: string;
    cancelBtn: string;
  };
  locations: {
    title: string;
    subtitle: string;
    pickingSearchPlaceholder: string;
    kpis: {
      totalAisles: string;
      totalRacks: string;
      assignedProducts: string;
    };
    layoutTitle: string;
    capacity: string;
    shelfContentsTitle: string;
    shelfContentsSubtitle: string;
    productsCount: string;
    emptyShelf: string;
    relocateBtn: string;
    receiveBtn: string;
  };
  relocateProduct: {
    title: string;
    subtitle: string;
    currentLocation: string;
    newLocationTitle: string;
    aisle: string;
    shelf: string;
    level: string;
    submitBtn: string;
    cancelBtn: string;
  };
  alerts: {
    title: string;
    subtitle: string;
    kpis: {
      critical: string;
      criticalSub: string;
      warning: string;
      warningSub: string;
      overstock: string;
      overstockSub: string;
      restockInvestment: string;
      restockInvestmentSub: string;
      itemsUnit: string;
    };
    filters: {
      searchPlaceholder: string;
      allCategories: string;
      allSeverities: string;
      all: string;
      critical: string;
      warning: string;
      overstock: string;
      selectAllForReorder: string;
      draftPoBtn: string;
      draftPoGeneral: string;
      clearSelection: string;
    };
    table: {
      severity: string;
      product: string;
      location: string;
      currentStock: string;
      safetyStock: string;
      suggestedOrder: string;
      estimatedCost: string;
      actions: string;
      emptyTitle: string;
      emptySubtitle: string;
      criticalBadge: string;
      warningBadge: string;
      overstockBadge: string;
      targetMeta: string;
      immobilized: string;
      eachCost: string;
      receiveBtn: string;
    };
  };
  purchaseOrder: {
    title: string;
    subtitle: string;
    supplierGroup: string;
    itemsCount: string;
    totalUnits: string;
    totalInvestment: string;
    copyClipboardBtn: string;
    downloadCsvBtn: string;
    copiedSuccess: string;
    closeBtn: string;
    emptyDraft: string;
    sku: string;
    product: string;
    brand: string;
    quantity: string;
    unitCost: string;
    estimatedTotal: string;
    disclaimer: string;
  };
  stockIntake: {
    title: string;
    subtitle: string;
    selectProduct: string;
    quantity: string;
    unitCost: string;
    totalCost: string;
    storePlacement: string;
    aisle: string;
    rack: string;
    shelf: string;
    deliveryNote: string;
    deliveryNotePlaceholder: string;
    photoProof: string;
    photoProofDesc: string;
    takePhotoBtn: string;
    uploadPhotoBtn: string;
    retakePhotoBtn: string;
    removePhotoBtn: string;
    submitBtn: string;
    cancelBtn: string;
  };
  settings: {
    title: string;
    subtitle: string;
    language: {
      title: string;
      subtitle: string;
      spanish: string;
      spanishDesc: string;
      english: string;
      englishDesc: string;
    };
    regional: {
      title: string;
      subtitle: string;
      currencyFormat: string;
      dateFormat: string;
      samplePrice: string;
      sampleDate: string;
    };
    system: {
      title: string;
      subtitle: string;
      version: string;
      runtime: string;
      database: string;
      migrations: string;
      productsTotal: string;
      movementsTotal: string;
      backupBtn: string;
      backupDesc: string;
    };
  };
}
