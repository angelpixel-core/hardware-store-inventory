/**
 * DDL Schema and Initial Migrations for SQLite Persistence.
 */

export const INITIAL_SCHEMA_SQL = `
-- Enforce Foreign Key constraints
PRAGMA foreign_keys = ON;

-- High performance Write-Ahead Logging mode
PRAGMA journal_mode = WAL;

-- 1. Products Master Table
CREATE TABLE IF NOT EXISTS products (
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
);

-- 2. Stock Movements (Kardex Ledger)
CREATE TABLE IF NOT EXISTS stock_movements (
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
);

-- 3. Indexes for Instant Lookups & Filtering
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_aisle ON products(location_aisle);
CREATE INDEX IF NOT EXISTS idx_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_type ON stock_movements(type);
CREATE INDEX IF NOT EXISTS idx_movements_created_at ON stock_movements(created_at DESC);
`;
