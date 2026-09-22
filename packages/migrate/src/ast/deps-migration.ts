import { isPlainSemverRange, parseMajor } from '../detect.js';
import type { PackageJson } from './package-json.js';
import type { Finding, Framework, Migration } from '../types.js';
import { findDependency, readPackageJson, setRange, writePackageJson } from './package-json.js';

/**
 * A bump target: either a major number (raised to `^{major}.0.0`) or an
 * explicit range used verbatim (e.g. `^3.5.0`).
 */
export type BumpTarget = number | string;

export interface DepsMigrationOptions {
  id: string;
  framework: Framework;
  docsUrl: string;
  /** `[packageName, target]` pairs. */
  bumps: [name: string, target: BumpTarget][];
  /** Packages to remove entirely (e.g. obsolete `@types/*`). */
  removes?: string[];
}

function targetRange(target: BumpTarget): string {
  return typeof target === 'number' ? `^${target}.0.0` : target;
}

/**
 * Parse the floor of a plain semver range (`^3.4.1`, `~3.5`, `3`) into
 * `[major, minor, patch]`, or `undefined` if it is not a plain range. The
 * version must sit at the start (after an optional operator) so protocol/URL
 * ranges are rejected rather than mined for a stray digit.
 */
function parseVersion(range: string): [number, number, number] | undefined {
  if (!isPlainSemverRange(range)) return undefined;
  const m = range.match(/^\s*[\^~>=<]*\s*(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
  if (!m) return undefined;
  return [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)];
}

/** Whether version `a` is strictly below `b`, compared major.minor.patch. */
function isBelow(a: [number, number, number], b: [number, number, number]): boolean {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] < b[i];
  }
  return false;
}

/**
 * Whether a dependency needs changing. Both target shapes compare a floor, so a
 * range already at or above the target is never rewritten or downgraded:
 *  - numeric target: the installed major must be below it.
 *  - range target (a minimum floor, e.g. `^3.5.0`): the installed version must
 *    be below the floor.
 */
function needsChange(pkg: PackageJson, name: string, target: BumpTarget): boolean {
  const dep = findDependency(pkg, name);
  if (!dep) return false;
  // Protocol/alias/URL ranges are never rewritten, whatever the target shape.
  if (!isPlainSemverRange(dep.range)) return false;
  if (typeof target === 'number') {
    return (parseMajor(dep.range) ?? Infinity) < target;
  }
  const floor = parseVersion(target);
  const current = parseVersion(dep.range);
  return floor !== undefined && current !== undefined && isBelow(current, floor);
}

/**
 * Build an auto-fixable migration that raises `package.json` dependency ranges
 * and removes obsolete packages. Factoring this out keeps every framework's
 * dependency migration to a short, declarative list and guarantees `detect`
 * and `fix` stay in lockstep.
 */
export function createDepsMigration(opts: DepsMigrationOptions): Migration {
  const { id, framework, docsUrl, bumps, removes = [] } = opts;

  return {
    id,
    framework,
    fromMajor: 8,
    toMajor: 9,
    status: 'stable',
    docsUrl,

    detect(ctx) {
      const parsed = readPackageJson(ctx);
      if (!parsed) return [];
      const findings: Finding[] = [];
      for (const [name, target] of bumps) {
        if (needsChange(parsed.pkg, name, target)) {
          findings.push({ filePath: 'package.json', line: 1, detail: `set ${name} to ${targetRange(target)}` });
        }
      }
      for (const name of removes) {
        if (findDependency(parsed.pkg, name)) {
          findings.push({ filePath: 'package.json', line: 1, detail: `remove ${name}` });
        }
      }
      return findings;
    },

    fix(ctx) {
      const parsed = readPackageJson(ctx);
      if (!parsed) return;
      const { pkg } = parsed;
      for (const [name, target] of bumps) {
        if (needsChange(pkg, name, target)) setRange(pkg, name, targetRange(target));
      }
      for (const name of removes) {
        delete pkg.dependencies?.[name];
        delete pkg.devDependencies?.[name];
      }
      writePackageJson(ctx, pkg);
    },
  };
}
