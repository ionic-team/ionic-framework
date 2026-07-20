import type { Framework, Migration } from './types.js';

export interface SelectOptions {
  /** Major version the project is currently on. */
  fromMajor: number;
  /** Major version to migrate to. */
  toMajor: number;
  /** Frameworks detected in the project. `core` migrations always apply. */
  frameworks: Framework[];
  /** Include `experimental` migrations. Defaults to `false`. */
  includeExperimental?: boolean;
}

/**
 * Choose the migrations that apply to a project, in the order they should run.
 *
 * A migration is selected when its version hop sits within the requested range
 * (`fromMajor <= migration.fromMajor` and `migration.toMajor <= toMajor`) and
 * its framework was detected (or it is a `core` migration). This is also the
 * safety gate against re-running: a project already on the target major yields
 * an empty range and therefore no migrations.
 */
export function selectMigrations(all: Migration[], opts: SelectOptions): Migration[] {
  const { fromMajor, toMajor, frameworks, includeExperimental = false } = opts;

  return all
    .filter((m) => m.fromMajor >= fromMajor && m.toMajor <= toMajor)
    .filter((m) => m.framework === 'core' || frameworks.includes(m.framework))
    .filter((m) => includeExperimental || m.status === 'stable')
    .sort((a, b) => a.fromMajor - b.fromMajor || a.id.localeCompare(b.id));
}
