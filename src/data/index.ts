import products from "./products.json";
import type { Product, StockMovement } from "../types/inventory";

export const mockProducts = products as Product[];

export const mockMovements: StockMovement[] = [
  { id: "m-006", productId: "p-002", type: "PURCHASE", quantity: 5, unitCost: 85000, location: mockProducts[1].location, note: "Reposición de proveedor", createdAt: "2026-09-13T16:30:00" },
  { id: "m-005", productId: "p-005", type: "SALE", quantity: 2, location: mockProducts[4].location, note: "Venta mostrador", createdAt: "2026-09-13T15:12:00" },
  { id: "m-004", productId: "p-011", type: "ADJUSTMENT", quantity: 1, location: mockProducts[10].location, note: "Conteo físico", createdAt: "2026-09-12T12:05:00" },
  { id: "m-003", productId: "p-001", type: "RETURN", quantity: 1, location: mockProducts[0].location, note: "Devolución de cliente", createdAt: "2026-09-12T10:40:00" },
  { id: "m-002", productId: "p-006", type: "SALE", quantity: 2, location: mockProducts[5].location, note: "Venta mostrador", createdAt: "2026-09-11T17:25:00" },
  { id: "m-001", productId: "p-004", type: "PURCHASE", quantity: 12, unitCost: 5600, location: mockProducts[3].location, note: "Ingreso inicial", createdAt: "2026-09-10T09:15:00" }
];
