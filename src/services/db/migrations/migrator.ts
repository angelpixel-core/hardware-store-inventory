import type Database from "@tauri-apps/plugin-sql";
import type { AppliedMigration, Migration } from "./types";

const CREATE_SCHEMA_MIGRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export interface MigrationResult {
  total: number;
  alreadyApplied: number;
  newlyApplied: number;
  appliedNames: string[];
}

/**
 * Migration Runner in the style of Rails / Drizzle.
 * Sequentially tracks and executes migrations with 4-digit versioning.
 */
export async function runMigrations(
  db: Database,
  migrations: Migration[],
): Promise<MigrationResult> {
  // 1. Ensure migrations tracking table exists
  await db.execute(CREATE_SCHEMA_MIGRATIONS_TABLE);

  // 2. Fetch already applied migration versions
  const appliedRows = await db.select<AppliedMigration[]>(
    "SELECT version, name, applied_at FROM schema_migrations ORDER BY version ASC",
  );
  const appliedVersions = new Set(appliedRows.map((r) => r.version));

  // 3. Sort migrations sequentially by 4-digit version string
  const sortedMigrations = [...migrations].sort((a, b) =>
    a.version.localeCompare(b.version),
  );

  let newlyApplied = 0;
  const appliedNames: string[] = [];

  // 4. Run pending migrations in order
  for (const migration of sortedMigrations) {
    if (appliedVersions.has(migration.version)) {
      continue;
    }

    console.info(
      `[Migrator] Ejecutando migración ${migration.version}: ${migration.name}...`,
    );

    // Execute SQL statements
    for (const statement of migration.statements) {
      if (statement.trim()) {
        await db.execute(statement);
      }
    }

    // Execute optional programmatic hook
    if (migration.up) {
      await migration.up(db);
    }

    // Record migration in ledger
    await db.execute(
      "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, datetime('now'))",
      [migration.version, migration.name],
    );

    console.info(
      `[Migrator] ✅ Migración ${migration.version} (${migration.name}) aplicada exitosamente.`,
    );

    newlyApplied++;
    appliedNames.push(migration.name);
  }

  return {
    total: sortedMigrations.length,
    alreadyApplied: appliedVersions.size,
    newlyApplied,
    appliedNames,
  };
}
