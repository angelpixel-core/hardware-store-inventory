import type { Migration } from "./types";

export const migration0002: Migration = {
  version: "0002",
  name: "0002_create_stock_movements_table",
  description: "Crea tabla de libro mayor (Kardex) para registrar transacciones de existencias",
  statements: [
    `CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK(type IN ('PURCHASE', 'SALE', 'RETURN', 'ADJUSTMENT')),
      quantity INTEGER NOT NULL,
      unit_cost REAL,
      location_store TEXT NOT NULL DEFAULT 'Principal',
      location_aisle TEXT NOT NULL,
      location_rack TEXT NOT NULL,
      location_shelf TEXT NOT NULL,
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
  ],
};
