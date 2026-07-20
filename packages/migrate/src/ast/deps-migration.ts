import { parseMajor } from '../detect.js';
import type { PackageJson } from './package-json.js';
import type { Finding, Framework, Migration } from '../types.js';
import { findDependency, readPackageJson, setRange, writePackageJson } from './package-json.js';

/**
 * A bump target: either a major number (raised to `^{major}.0.0`) for normal
 * published packages, or an explicit version string (used verbatim) for
 * unpublished `@ionic/*` dev builds.
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
 * Ranges that don't express a plain, comparable version and must never be
 * rewritten: protocol/alias references (`workspace:`, `catalog:`, `npm:`,
 * `file:`, `link:`, `portal:`), git/URL refs, and dist-tags (`latest`, `*`).
 * These can embed a digit (`catalog:vue3`, `git+...#v3.4.0`), so a bare
 * digit-scan would wrongly treat them as a version.
 */
function isPlainSemverRange(range: string): boolean {
  if (/^(workspace|catalog|npm|file|link|portal|git|https?):/.test(range)) return false;
  if (/^git\+|:\/\//.test(range)) return false;
  // A plain range starts with an optional operator then a number.
  return /^\s*[\^~>=<]*\s*\d/.test(range);
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
 * Whether a dependency needs changing:
 *  - numeric target: the installed major must be below it.
 *  - caret/tilde range target (a minimum floor, e.g. `^3.5.0`): bump only when
 *    the installed version is below the floor, so a higher pin is never
 *    downgraded.
 *  - explicit version string (an unpublished dev build): the range must simply
 *    differ - a major comparison won't work because a `8.8.x-dev` build of v9
 *    still reads as major 8.
 */
function needsChange(pkg: PackageJson, name: string, target: BumpTarget): boolean {
  const dep = findDependency(pkg, name);
  if (!dep) return false;
  // Protocol/alias/URL ranges are never rewritten, whatever the target shape.
  if (!isPlainSemverRange(dep.range)) return false;
  if (typeof target === 'number') {
    return (parseMajor(dep.range) ?? Infinity) < target;
  }
  if (target.startsWith('^') || target.startsWith('~')) {
    const current = parseVersion(dep.range);
    return current !== undefined && isBelow(current, parseVersion(target)!);
  }
  return dep.range !== target;
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
