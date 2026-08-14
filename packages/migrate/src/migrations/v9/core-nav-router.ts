import type { Migration } from '../../types.js';
import { scanLines, SOURCE_GLOBS } from '../../ast/text-scan.js';

/**
 * `ion-nav` no longer integrates with `ion-router` in v9. The `setRouteId()`
 * and `getRouteId()` methods and the `updateURL` nav option are removed, and
 * navigating an `ion-nav` no longer changes the URL. This is a runtime break,
 * not a compile error, so it's flagged for manual rework: URL-driven stacks
 * should move to `ion-router-outlet`.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#nav
 */
export const coreNavRouter: Migration = {
  id: 'core-nav-router',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#nav',

  detect(ctx) {
    return scanLines(ctx, SOURCE_GLOBS, (line) => {
      if (/\bsetRouteId\b|\bgetRouteId\b/.test(line)) {
        return 'setRouteId/getRouteId removed. ion-nav no longer integrates with ion-router';
      }
      if (/\bupdateURL\b/.test(line)) {
        return 'updateURL nav option removed. Use ion-router-outlet for URL-based routing';
      }
      return undefined;
    });
  },
};
