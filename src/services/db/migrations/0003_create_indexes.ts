import type { Migration } from "./types";

export const migration0003: Migration = {
  version: "0003",
  name: "0003_create_indexes",
  description: "Crea índices para búsquedas optimizadas por SKU, categoría, pasillo y fecha de Kardex",
  statements: [
    "CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);",
    "CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);",
    "CREATE INDEX IF NOT EXISTS idx_products_aisle ON products(location_aisle);",
    "CREATE INDEX IF NOT EXISTS idx_movements_product_id ON stock_movements(product_id);",
    "CREATE INDEX IF NOT EXISTS idx_movements_type ON stock_movements(type);",
    "CREATE INDEX IF NOT EXISTS idx_movements_created_at ON stock_movements(created_at DESC);",
  ],
};
