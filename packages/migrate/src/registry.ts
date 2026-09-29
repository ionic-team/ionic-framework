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
 * The newest major any registered migration targets, counting every entry
 * regardless of `status`. Private on purpose: comparing against it directly means
 * re-deriving {@link resolveTarget}'s ceiling and clamp by hand. Read it off
 * `resolveTarget`'s `latestMajor` instead.
 */
function latestKnownMajor(all: Migration[]): number {
  return all.reduce((max, m) => Math.max(max, m.toMajor), 0);
}

/**
 * What to do with a requested version range. Carries `reason` codes and numbers,
 * not prose, so the wording stays with the CLI that owns every other string.
 */
export type TargetDecision =
  | { kind: 'invalid'; reason: 'below-source' | 'not-above-source'; requestedTo: number; fromMajor: number }
  | { kind: 'nothing-to-do'; reason: 'at-ceiling'; fromMajor: number; latestMajor: number }
  | { kind: 'run'; toMajor: number; clampedFrom?: number };

/**
 * Resolve the range to migrate from the source major and an optional target.
 *
 * The ceiling check is on the *source*, not the target, so it can't hide real
 * work: a selectable migration would need `toMajor > fromMajor >= latestMajor`,
 * contradicting `latestMajor` being the largest `toMajor`.
 *
 * Refuse versus clamp splits on whether the range can ever hold work. At or below
 * the source it never can. Above the ceiling the hops below it still apply, and
 * refusing those would report an unmigrated app as clean under `--check`.
 *
 * Running before selection is only sound while the source ceiling is the one
 * cause of an empty selection worth naming. When something filtered out by
 * framework or by `status: 'experimental'` needs its own message, move this after
 * {@link selectMigrations} rather than adding a fourth branch.
 */
export function resolveTarget(all: Migration[], fromMajor: number, requestedTo?: number): TargetDecision {
  const latestMajor = latestKnownMajor(all);

  if (requestedTo !== undefined && requestedTo < fromMajor) {
    return { kind: 'invalid', reason: 'below-source', requestedTo, fromMajor };
  }

  if (fromMajor >= latestMajor) {
    return { kind: 'nothing-to-do', reason: 'at-ceiling', fromMajor, latestMajor };
  }

  // A target equal to the source is either a typo for the next major or a
  // deliberate pin, and nothing tells them apart. Rejecting picks the typo, since
  // that's the silent one: an empty `[n, n]` range prints "0 migration(s)" for an
  // app with pending work. This only bites once a v10 lands, and `--to 9` is then
  // the only way to say "not v10 yet" - give pinning its own spelling rather than
  // relaxing this, which would bring the false all-clear back.
  if (requestedTo === fromMajor) {
    return { kind: 'invalid', reason: 'not-above-source', requestedTo, fromMajor };
  }

  const target = requestedTo ?? fromMajor + 1;
  const toMajor = Math.min(target, latestMajor);
  return { kind: 'run', toMajor, ...(target > toMajor ? { clampedFrom: target } : {}) };
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
