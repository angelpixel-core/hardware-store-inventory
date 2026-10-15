import type Database from "@tauri-apps/plugin-sql";

export interface Migration {
  /** 4-digit sequential version string (e.g. "0001", "0002") */
  version: string;
  /** Human-readable identifier matching the filename */
  name: string;
  /** Explanatory description of what the migration provisions */
  description: string;
  /** SQL statements to execute sequentially */
  statements: string[];
  /** Optional custom execution hook */
  up?: (db: Database) => Promise<void>;
}

export interface AppliedMigration {
  version: string;
  name: string;
  applied_at: string;
}
