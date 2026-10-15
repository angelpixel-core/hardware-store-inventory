import type { Migration } from "./types";

export const migration0001: Migration = {
  version: "0001",
  name: "0001_create_products_table",
  description: "Crea tabla maestra de productos con especificaciones, ubicación y precios",
  statements: [
    `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      barcode TEXT NOT NULL,
      unit TEXT NOT NULL DEFAULT 'un',
      stock INTEGER NOT NULL DEFAULT 0,
      minimum_stock INTEGER NOT NULL DEFAULT 1,
      price REAL NOT NULL DEFAULT 0.0,
      cost REAL NOT NULL DEFAULT 0.0,
      location_store TEXT NOT NULL DEFAULT 'Principal',
      location_aisle TEXT NOT NULL,
      location_rack TEXT NOT NULL,
      location_shelf TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      image TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
  ],
};
