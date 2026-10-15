import { getDatabase } from "./connection";
import type { StockMovement, StockMovementType } from "../../types/inventory";
import { mockMovements } from "../../data";

interface MovementRow {
  id: string;
  product_id: string;
  type: StockMovementType;
  quantity: number;
  unit_cost: number | null;
  location_store: string;
  location_aisle: string;
  location_rack: string;
  location_shelf: string;
  note: string | null;
  created_at: string;
}

function mapRowToMovement(row: MovementRow): StockMovement {
  return {
    id: row.id,
    productId: row.product_id,
    type: row.type,
    quantity: row.quantity,
    unitCost: row.unit_cost ?? undefined,
    location: {
      store: row.location_store,
      aisle: row.location_aisle,
      rack: row.location_rack,
      shelf: row.location_shelf,
    },
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

// In-memory fallback if not in Tauri
let inMemoryMovements: StockMovement[] = [...mockMovements];

export const movementRepository = {
  /**
   * Loads all stock movements from Kardex ordered by creation date descending.
   */
  async loadAllMovements(): Promise<StockMovement[]> {
    const db = await getDatabase();
    if (!db) {
      return [...inMemoryMovements];
    }

    const rows = await db.select<MovementRow[]>(
      `SELECT
        id, product_id, type, quantity, unit_cost, location_store,
        location_aisle, location_rack, location_shelf, note, created_at
      FROM stock_movements
      ORDER BY created_at DESC`,
    );

    return rows.map(mapRowToMovement);
  },

  /**
   * Loads stock movements for a specific product.
   */
  async getMovementsByProductId(productId: string): Promise<StockMovement[]> {
    const db = await getDatabase();
    if (!db) {
      return inMemoryMovements.filter((m) => m.productId === productId);
    }

    const rows = await db.select<MovementRow[]>(
      `SELECT
        id, product_id, type, quantity, unit_cost, location_store,
        location_aisle, location_rack, location_shelf, note, created_at
      FROM stock_movements
      WHERE product_id = ?
      ORDER BY created_at DESC`,
      [productId],
    );

    return rows.map(mapRowToMovement);
  },

  /**
   * Inserts a new movement transaction into Kardex ledger.
   */
  async insertMovement(movement: StockMovement): Promise<void> {
    const db = await getDatabase();
    if (!db) {
      inMemoryMovements = [movement, ...inMemoryMovements];
      return;
    }

    await db.execute(
      `INSERT INTO stock_movements (
        id, product_id, type, quantity, unit_cost, location_store,
        location_aisle, location_rack, location_shelf, note, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        movement.id,
        movement.productId,
        movement.type,
        movement.quantity,
        movement.unitCost ?? null,
        movement.location.store,
        movement.location.aisle,
        movement.location.rack,
        movement.location.shelf,
        movement.note ?? null,
        movement.createdAt,
      ],
    );
  },
};
