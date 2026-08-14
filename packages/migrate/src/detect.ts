import type { MigrationContext } from './context.js';
import type { Framework } from './types.js';

/** An Ionic framework binding found in the project, with its installed major. */
export interface DetectedFramework {
  framework: Framework;
  major: number;
}

/**
 * The package that identifies each framework. `core` is listed too: a vanilla
 * app has no binding package, so without it the run exits before any `core`
 * migration runs against the project. A framework app that pins `@ionic/core`
 * directly detects both, and that pin has to reach v9 too.
 */
const FRAMEWORK_PACKAGES: Record<Framework, string> = {
  angular: '@ionic/angular',
  react: '@ionic/react',
  vue: '@ionic/vue',
  core: '@ionic/core',
};

/** Extract the major version from a semver range like `^8.4.1` or `~9.0.0-rc.1`. */
export function parseMajor(range: string | undefined): number | undefined {
  if (!range) return undefined;
  const match = range.match(/(\d+)/);
  return match ? Number(match[1]) : undefined;
}

/** Compare dotted numeric versions, so `16.10` sorts above `16.4`. */
export function compareVersions(a: string, b: string): number {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/**
 * Whether a range is a plain, comparable semver range rather than a
 * protocol/alias reference (`workspace:`, `catalog:`, `npm:`, `file:`, `link:`,
 * `portal:`), git/URL ref, or dist-tag (`latest`, `*`). Those can embed a digit
 * (`catalog:vue3`, `git+...#v3.4.0`), so a bare digit-scan would wrongly treat
 * them as a version.
 */
export function isPlainSemverRange(range: string): boolean {
  if (/^(workspace|catalog|npm|file|link|portal|git|https?):/.test(range)) return false;
  if (/^git\+|:\/\//.test(range)) return false;
  // A plain range starts with an optional operator then a number.
  return /^\s*[\^~>=<]*\s*\d/.test(range);
}

/**
 * The major to migrate from. A binding package wins over `@ionic/core` when both
 * are declared: the single-shot migrations key off the binding, so an app on a
 * v9 binding that never bumped its own `@ionic/core` pin is already migrated,
 * and taking the lowest major would re-select them and corrupt its imports.
 */
export function sourceMajor(detected: DetectedFramework[]): number | undefined {
  const bindings = detected.filter((d) => d.framework !== 'core');
  const gating = bindings.length > 0 ? bindings : detected;
  return gating.length > 0 ? Math.min(...gating.map((d) => d.major)) : undefined;
}

/**
 * Determine which Ionic framework binding(s) a project depends on and the major
 * version installed for each, by reading its `package.json`.
 */
export function detectFrameworks(ctx: MigrationContext): DetectedFramework[] {
  const pkgText = ctx.readFile('package.json');
  if (!pkgText) return [];

  let pkg: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  try {
    pkg = JSON.parse(pkgText);
  } catch (e) {
    throw new Error(`Could not parse package.json in ${ctx.rootDir}: ${(e as Error).message}`);
  }
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };

  const detected: DetectedFramework[] = [];
  for (const [framework, pkgName] of Object.entries(FRAMEWORK_PACKAGES) as [Framework, string][]) {
    const range = deps[pkgName];
    if (range === undefined) continue;
    // Only a plain, bumpable semver range gates re-runs correctly. angular-deps
    // won't rewrite a protocol/alias range (npm:, git+, workspace:, ...), so if
    // we migrated one the version gate would never close and single-shot
    // migrations could re-run and corrupt already-migrated code. Skip it.
    if (!isPlainSemverRange(range)) continue;
    const major = parseMajor(range);
    if (major !== undefined) {
      detected.push({ framework, major });
    }
  }
  return detected;
}
