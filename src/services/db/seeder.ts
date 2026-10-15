import type Database from "@tauri-apps/plugin-sql";
import { mockProducts, mockMovements } from "../../data";

/**
 * Seeds initial catalog products and movements into SQLite
 * only if the database is currently empty.
 */
export async function seedInitialData(db: Database): Promise<{
  seededProducts: number;
  seededMovements: number;
}> {
  let seededProducts = 0;
  let seededMovements = 0;

  // Insert mock products
  for (const p of mockProducts) {
    await db.execute(
      `INSERT OR IGNORE INTO products (
        id, name, brand, category, sku, barcode, unit, stock, minimum_stock,
        price, cost, location_store, location_aisle, location_rack, location_shelf,
        description, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id,
        p.name,
        p.brand,
        p.category,
        p.sku,
        p.barcode,
        p.unit,
        p.stock,
        p.minimumStock,
        p.price,
        p.cost,
        p.location.store,
        p.location.aisle,
        p.location.rack,
        p.location.shelf,
        p.description || "",
        p.image || null,
      ],
    );
    seededProducts++;
  }

  // Insert mock movements
  for (const m of mockMovements) {
    await db.execute(
      `INSERT OR IGNORE INTO stock_movements (
        id, product_id, type, quantity, unit_cost, location_store,
        location_aisle, location_rack, location_shelf, note, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.id,
        m.productId,
        m.type,
        m.quantity,
        m.unitCost ?? null,
        m.location.store,
        m.location.aisle,
        m.location.rack,
        m.location.shelf,
        m.note ?? null,
        m.createdAt,
      ],
    );
    seededMovements++;
  }

  return { seededProducts, seededMovements };
}
