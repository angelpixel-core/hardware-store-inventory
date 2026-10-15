import { getDatabase } from "./connection";
import type { Product, ProductLocation } from "../../types/inventory";
import { mockProducts } from "../../data";

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  barcode: string;
  unit: string;
  stock: number;
  minimum_stock: number;
  price: number;
  cost: number;
  location_store: string;
  location_aisle: string;
  location_rack: string;
  location_shelf: string;
  description: string;
  image: string | null;
  created_at?: string;
  updated_at?: string;
}

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    sku: row.sku,
    barcode: row.barcode,
    unit: row.unit,
    stock: row.stock,
    minimumStock: row.minimum_stock,
    price: row.price,
    cost: row.cost,
    location: {
      store: row.location_store,
      aisle: row.location_aisle,
      rack: row.location_rack,
      shelf: row.location_shelf,
    },
    description: row.description,
    image: row.image ?? undefined,
  };
}

// In-memory fallback if not in Tauri
let inMemoryProducts: Product[] = [...mockProducts];

export const productRepository = {
  /**
   * Loads all products ordered by name ascending.
   */
  async loadAllProducts(): Promise<Product[]> {
    const db = await getDatabase();
    if (!db) {
      return [...inMemoryProducts];
    }

    const rows = await db.select<ProductRow[]>(
      `SELECT
        id, name, brand, category, sku, barcode, unit, stock, minimum_stock,
        price, cost, location_store, location_aisle, location_rack, location_shelf,
        description, image, created_at, updated_at
      FROM products
      ORDER BY name ASC`,
    );

    return rows.map(mapRowToProduct);
  },

  /**
   * Fetches a single product by ID.
   */
  async getProductById(productId: string): Promise<Product | null> {
    const db = await getDatabase();
    if (!db) {
      return inMemoryProducts.find((p) => p.id === productId) ?? null;
    }

    const rows = await db.select<ProductRow[]>(
      `SELECT
        id, name, brand, category, sku, barcode, unit, stock, minimum_stock,
        price, cost, location_store, location_aisle, location_rack, location_shelf,
        description, image, created_at, updated_at
      FROM products
      WHERE id = ?
      LIMIT 1`,
      [productId],
    );

    if (rows.length === 0) return null;
    return mapRowToProduct(rows[0]);
  },

  /**
   * Inserts a new product into the database.
   */
  async insertProduct(product: Product): Promise<void> {
    const db = await getDatabase();
    if (!db) {
      inMemoryProducts = [product, ...inMemoryProducts];
      return;
    }

    await db.execute(
      `INSERT INTO products (
        id, name, brand, category, sku, barcode, unit, stock, minimum_stock,
        price, cost, location_store, location_aisle, location_rack, location_shelf,
        description, image, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        product.id,
        product.name,
        product.brand,
        product.category,
        product.sku,
        product.barcode,
        product.unit,
        product.stock,
        product.minimumStock,
        product.price,
        product.cost,
        product.location.store,
        product.location.aisle,
        product.location.rack,
        product.location.shelf,
        product.description,
        product.image ?? null,
      ],
    );
  },

  /**
   * Updates only the stock quantity and updated_at timestamp of a product.
   */
  async updateProductStock(productId: string, newStock: number): Promise<void> {
    const db = await getDatabase();
    if (!db) {
      inMemoryProducts = inMemoryProducts.map((p) =>
        p.id === productId ? { ...p, stock: newStock } : p,
      );
      return;
    }

    await db.execute(
      `UPDATE products
       SET stock = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [newStock, productId],
    );
  },

  /**
   * Updates the physical warehouse location coordinates of a product.
   */
  async updateProductLocation(
    productId: string,
    location: ProductLocation,
  ): Promise<void> {
    const db = await getDatabase();
    if (!db) {
      inMemoryProducts = inMemoryProducts.map((p) =>
        p.id === productId ? { ...p, location } : p,
      );
      return;
    }

    await db.execute(
      `UPDATE products
       SET location_store = ?, location_aisle = ?, location_rack = ?, location_shelf = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [location.store, location.aisle, location.rack, location.shelf, productId],
    );
  },
};
