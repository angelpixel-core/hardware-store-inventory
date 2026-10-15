import Database from "@tauri-apps/plugin-sql";
import { seedInitialData } from "./seeder";

export const DB_FILENAME = "sqlite:hardware_inventory.db";

let dbInstance: Database | null = null;
let isInitialized = false;

/**
 * Checks if the current environment is running inside the Tauri native desktop window.
 */
export function isTauriEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  return "__TAURI_INTERNALS__" in window || "__TAURI__" in window;
}

const DDL_STATEMENTS = [
  "PRAGMA foreign_keys = ON",
  "PRAGMA journal_mode = WAL",
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
  )`,
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
  )`,
  "CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)",
  "CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)",
  "CREATE INDEX IF NOT EXISTS idx_products_aisle ON products(location_aisle)",
  "CREATE INDEX IF NOT EXISTS idx_movements_product_id ON stock_movements(product_id)",
  "CREATE INDEX IF NOT EXISTS idx_movements_type ON stock_movements(type)",
  "CREATE INDEX IF NOT EXISTS idx_movements_created_at ON stock_movements(created_at DESC)",
];

/**
 * Initializes the SQLite database, executes schema migrations,
 * and seeds initial data if the tables are empty.
 */
export async function initDatabase(): Promise<Database | null> {
  if (!isTauriEnvironment()) {
    console.warn(
      "[Database] Running in web/browser mode: Tauri IPC is not available. Using in-memory fallback.",
    );
    return null;
  }

  if (dbInstance && isInitialized) {
    return dbInstance;
  }

  try {
    const db = await Database.load(DB_FILENAME);
    dbInstance = db;

    // Execute schema migrations
    for (const statement of DDL_STATEMENTS) {
      await db.execute(statement);
    }

    // Check if products table is empty to trigger seeding
    const result = await db.select<{ count: number }[]>(
      "SELECT count(*) as count FROM products",
    );

    const rowCount = result[0]?.count ?? 0;
    if (rowCount === 0) {
      console.info("[Database] Empty database detected. Seeding initial catalog and kardex...");
      const seeded = await seedInitialData(db);
      console.info(
        `[Database] Seeding completed: ${seeded.seededProducts} products, ${seeded.seededMovements} movements.`,
      );
    }

    isInitialized = true;
    return dbInstance;
  } catch (error) {
    console.error("[Database] Failed to initialize SQLite database:", error);
    throw error;
  }
}

/**
 * Returns the active Database instance or loads it if not already connected.
 */
export async function getDatabase(): Promise<Database | null> {
  if (dbInstance && isInitialized) {
    return dbInstance;
  }
  return initDatabase();
}
