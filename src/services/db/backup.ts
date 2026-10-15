import { productRepository } from "./productRepository";
import { movementRepository } from "./movementRepository";
import type { Product, StockMovement } from "../../types/inventory";

export interface DatabaseBackupPayload {
  version: string;
  system: string;
  generatedAt: string;
  products: Product[];
  movements: StockMovement[];
}

/**
 * Generates and downloads a complete JSON snapshot backup of the SQLite database.
 */
export async function exportDatabaseBackup(): Promise<DatabaseBackupPayload> {
  const [products, movements] = await Promise.all([
    productRepository.loadAllProducts(),
    movementRepository.loadAllMovements(),
  ]);

  const payload: DatabaseBackupPayload = {
    version: "0.2.0",
    system: "Hardware Store Inventory - Local SQLite Backup",
    generatedAt: new Date().toISOString(),
    products,
    movements,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `backup-ferreteria-${new Date().toISOString().split("T")[0]}.json`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return payload;
}
