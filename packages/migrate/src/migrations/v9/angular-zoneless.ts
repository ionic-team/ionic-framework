import type { Migration } from '../../types.js';
import { scanLines } from '../../ast/text-scan.js';

/**
 * Ionic 9 defaults to zoneless change detection (Angular 21+ bootstraps
 * zoneless out of the box). Report-only: preserving Zone.js behavior requires
 * coordinated, version-dependent edits (add `provideZoneChangeDetection()` at
 * the bootstrap AND keep `zone.js` in `angular.json` polyfills). Adding the
 * provider without the polyfill errors at runtime, so this flags the bootstrap
 * for review rather than risking a half-applied auto-fix.
 *
 * See https://ionicframework.com/docs/updating/9-0#zoneless-change-detection
 */
const BOOTSTRAP = /\b(bootstrapApplication|bootstrapModule|platformBrowserDynamic)\b/;

export const angularZoneless: Migration = {
  id: 'angular-zoneless',
  framework: 'angular',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#zoneless-change-detection',

  detect(ctx) {
    return scanLines(ctx, ['**/main.ts', '**/main.tsx'], (line) =>
      BOOTSTRAP.test(line)
        ? 'Ionic 9 is zoneless by default; to keep Zone.js add provideZoneChangeDetection() and keep zone.js in polyfills'
        : undefined
    );
  },
};
