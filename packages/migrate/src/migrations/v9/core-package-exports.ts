import type { Migration } from '../../types.js';
import { scanLines, SOURCE_GLOBS } from '../../ast/text-scan.js';

/**
 * `@ionic/core` now declares an `exports` field, which is an allowlist: a
 * subpath it does not name stops resolving under Node ESM, webpack 5, and
 * TypeScript's `bundler`/`node16`/`nodenext` resolution.
 *
 * Scanned as text rather than through ts-morph because the apps most likely to
 * reach into `@ionic/core` directly are vanilla ones, whose sources are `.js`
 * and `.html` - neither of which ts-morph loads (`allowJs: false`).
 *
 * Report-only: which supported subpath replaces an internal path depends on
 * what was being imported.
 *
 * See https://ionicframework.com/docs/updating/9-0#package-exports
 */
/**
 * A quoted `@ionic/core` specifier. The closing quote is required so a package
 * that merely shares the prefix (`@ionic/core-utils`) does not match.
 */
const CORE_SPECIFIER = /['"`](@ionic\/core(?:\/[^'"`]*)?)['"`]/;

/**
 * Every key the `exports` map declares, mirrored from `core/package.json`
 * rather than the guide's table, which lists only the recommended entry points.
 * A wildcard key (`./dist/*`) matches any path below it.
 */
const ALLOWED = [
  /^@ionic\/core$/,
  /^@ionic\/core\/components(\/.+)?$/,
  /^@ionic\/core\/loader(\/.+)?$/,
  /^@ionic\/core\/hydrate(\/.+)?$/,
  /^@ionic\/core\/css\/.+$/,
  /^@ionic\/core\/dist\/.+$/,
  /^@ionic\/core\/package\.json$/,
];

export const corePackageExports: Migration = {
  id: 'core-package-exports',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#package-exports',

  detect(ctx) {
    return scanLines(ctx, SOURCE_GLOBS, (line) => {
      const specifier = CORE_SPECIFIER.exec(line)?.[1];
      if (specifier === undefined || ALLOWED.some((allowed) => allowed.test(specifier))) return undefined;
      return `'${specifier}' is not a declared @ionic/core export. Switch to a supported subpath`;
    });
  },
};
