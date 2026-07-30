import { test as base, expect } from '@playwright/test';

/**
 * Wraps `page.goto` so animations are disabled by default. Every navigation
 * appends `ionic:_testing=true` unless the URL already sets the param. To
 * exercise real animations, pass `withAnimations(path)` (which sets
 * `ionic:_testing=false`) so the override is explicit.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const originalGoto = page.goto.bind(page);
    page.goto = (url, options) => {
      const isAbsolute = /^https?:\/\//i.test(url);
      const parsed = new URL(url, isAbsolute ? undefined : 'http://placeholder');
      if (!parsed.searchParams.has('ionic:_testing')) {
        parsed.searchParams.set('ionic:_testing', 'true');
      }
      const finalUrl = isAbsolute
        ? parsed.toString()
        : `${parsed.pathname}${parsed.search}${parsed.hash}`;
      return originalGoto(finalUrl, options);
    };
    await use(page);
  },
});

/**
 * Opt out of the default animations-off behavior for a single navigation.
 * Animation-specific tests (e.g. `animations.spec.ts`) use this to make the
 * intent visible at the call site.
 */
export function withAnimations(path: string): string {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}ionic:_testing=false`;
}

export { expect };
