import type { Migration } from "./types";
import { migration0001 } from "./0001_create_products_table";
import { migration0002 } from "./0002_create_stock_movements_table";
import { migration0003 } from "./0003_create_indexes";

export * from "./types";
export * from "./migrator";

/**
 * Sequential list of all migrations.
 */
export const allMigrations: Migration[] = [
  migration0001,
  migration0002,
  migration0003,
];
