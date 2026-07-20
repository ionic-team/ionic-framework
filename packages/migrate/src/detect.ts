import type { MigrationContext } from './context.js';
import type { Framework } from './types.js';
import { IONIC_V9_VERSION } from './versions.js';

/** An Ionic framework binding found in the project, with its installed major. */
export interface DetectedFramework {
  framework: Framework;
  major: number;
}

const FRAMEWORK_PACKAGES: Record<Exclude<Framework, 'core'>, string> = {
  angular: '@ionic/angular',
  react: '@ionic/react',
  vue: '@ionic/vue',
};

/** Extract the major version from a semver range like `^8.4.1` or `~9.0.0-rc.1`. */
export function parseMajor(range: string | undefined): number | undefined {
  if (!range) return undefined;
  const match = range.match(/(\d+)/);
  return match ? Number(match[1]) : undefined;
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
  for (const [framework, pkgName] of Object.entries(FRAMEWORK_PACKAGES) as [
    Exclude<Framework, 'core'>,
    string,
  ][]) {
    const range = deps[pkgName];
    // A project already pinned to the v9 dev build reads as major 8 via semver
    // (the pin is versioned `8.8.x-dev`), so recognize it explicitly as v9.
    // This closes the re-run gate: a migrated project detects as v9 and selects
    // no v8->v9 migrations. Remove once the pin becomes `^9.0.0` at GA.
    const major = range === IONIC_V9_VERSION ? 9 : parseMajor(range);
    if (major !== undefined) {
      detected.push({ framework, major });
    }
  }
  return detected;
}
