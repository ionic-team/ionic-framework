import type { MigrationContext } from './context.js';
import type { Finding, Migration } from './types.js';

/** Outcome of running a single migration. */
export interface RunEntry {
  migration: Migration;
  findings: Finding[];
  /** Whether {@link Migration.fix} was applied. `false` for report-only or dry runs. */
  applied: boolean;
}

export interface RunResult {
  entries: RunEntry[];
}

export interface RunOptions {
  /** Report what would change without writing anything. */
  dryRun?: boolean;
}

/**
 * Run migrations against a context. Each migration is detected first; only
 * migrations with findings are reported. Auto-fixable migrations are applied
 * unless {@link RunOptions.dryRun} is set. Report-only migrations (no `fix`)
 * are always reported but never applied.
 */
export function run(
  ctx: MigrationContext,
  migrations: Migration[],
  { dryRun = false }: RunOptions = {}
): RunResult {
  const entries: RunEntry[] = [];
  let mutated = false;

  for (const migration of migrations) {
    const findings = migration.detect(ctx);
    if (findings.length === 0) continue;

    let applied = false;
    if (!dryRun && migration.fix) {
      migration.fix(ctx);
      applied = true;
      mutated = true;
    }
    entries.push({ migration, findings, applied });
  }

  if (mutated) {
    ctx.save();
  }
  return { entries };
}
