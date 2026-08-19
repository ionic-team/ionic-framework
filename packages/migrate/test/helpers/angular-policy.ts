import { createInMemoryContext } from '../../src/context.js';
import type { MigrationContext } from '../../src/context.js';

/** Angular 20 ships its policy as a static browserslist file. */
export const ANGULAR_20_POLICY = `# Angular's supported browsers\n\nChrome >= 107\nChromeAndroid >= 107\nEdge >= 107\nFirefox >= 104\nSafari >= 16\niOS >= 16\n`;

/** Angular 21+ builds its policy from this constant instead. */
export const ANGULAR_BASELINE = `const BASELINE_DATE = '2025-10-20';\n`;

/**
 * A stand-in for the project's `browserslist`, resolving a fixed policy and
 * recording the queries it was handed.
 */
export function fakeBrowserslist(resolved: string[]) {
  const queries: unknown[] = [];
  return Object.assign(
    (query: unknown) => {
      queries.push(query);
      return resolved;
    },
    { queries }
  );
}

/** An Angular project with `@angular/build` installed and its policy resolvable. */
export function angularProject(options: {
  major: number;
  files: Record<string, string>;
  resolved: string[];
  /** Where the installed `@angular/build` sits, for the devkit-nested layout. */
  buildDir?: string;
}): MigrationContext {
  // Only the default layout installs `@angular/build` at the top level. The
  // devkit-nested one must not, or the test stops discriminating.
  const buildDir = options.buildDir ?? 'node_modules/@angular/build';
  return createInMemoryContext(
    {
      'package.json': JSON.stringify({ dependencies: { '@angular/core': `^${options.major}.0.0` } }, null, 2),
      ...(options.buildDir === undefined ? { 'node_modules/@angular/build/package.json': '{}' } : {}),
      [`${buildDir}/src/utils/supported-browsers.js`]: ANGULAR_BASELINE,
      ...options.files,
    },
    '/app',
    { browserslist: fakeBrowserslist(options.resolved) }
  );
}
