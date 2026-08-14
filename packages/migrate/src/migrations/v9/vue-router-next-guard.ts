import type { Migration } from '../../types.js';
import { scanLines } from '../../ast/text-scan.js';

/**
 * Vue Router 5 deprecates calling `next()` inside navigation guards. The
 * return-value form is preferred. Report-only: flags files that declare guards
 * so the developer can migrate the callback style. The dep bump itself is
 * handled by `vue-deps`.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#deprecation-warning-for-next-in-navigation-guards
 */
// The global `beforeEach`/`beforeResolve` guards must be called on a router
// instance (`router.beforeEach(...)`); requiring a router-suffixed receiver
// avoids flagging both bare `beforeEach()` hooks and Playwright's
// `test.beforeEach()`. The component-guard names are Vue-specific and safe to
// match on their own.
const GUARD_HOOKS =
  /(\b\w*[Rr]outer\s*\.\s*(beforeEach|beforeResolve)\b)|\b(beforeRouteEnter|beforeRouteLeave|beforeRouteUpdate|onBeforeRouteLeave|onBeforeRouteUpdate)\b/;

export const vueRouterNextGuard: Migration = {
  id: 'vue-router-next-guard',
  framework: 'vue',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl:
    'https://ionicframework.com/docs/updating/9-0#deprecation-warning-for-next-in-navigation-guards',

  detect(ctx) {
    return scanLines(ctx, ['**/*.ts', '**/*.js', '**/*.vue'], (line) =>
      GUARD_HOOKS.test(line)
        ? 'navigation guard: migrate next() calls to the return-value form (vue-router 5)'
        : undefined
    );
  },
};
