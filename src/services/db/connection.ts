import Database from "@tauri-apps/plugin-sql";
import { allMigrations, runMigrations } from "./migrations";
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

/**
 * Initializes the SQLite database, executes 4-digit sequential migrations,
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

    // Enforce relational integrity and performance
    await db.execute("PRAGMA foreign_keys = ON;");
    await db.execute("PRAGMA journal_mode = WAL;");

    // Execute 4-digit sequential migrations (Rails / Drizzle style)
    const migrationResult = await runMigrations(db, allMigrations);
    if (migrationResult.newlyApplied > 0) {
      console.info(
        `[Database] ${migrationResult.newlyApplied} nuevas migraciones aplicadas:`,
        migrationResult.appliedNames,
      );
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
