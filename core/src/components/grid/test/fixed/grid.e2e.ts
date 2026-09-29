import { expect } from '@playwright/test';
import type { ScreenBreakpoint } from '@utils/breakpoints';
import { DEFAULT_SCREEN_BREAKPOINTS, SCREEN_BREAKPOINT_NAMES } from '@utils/breakpoints';
import { configs, test } from '@utils/test/playwright';

import { defaultTheme as mdTheme } from '../../../../themes/md/default.tokens';

const ionGridBreakpoints = mdTheme.components!.IonGrid!.breakpoint!;

/**
 * Viewport width that activates each breakpoint. `max(400, minWidth)` lands
 * exactly on the threshold for sm and up (firing only that breakpoint's rule
 * and nothing above it) while giving xs a renderable non-zero viewport.
 *
 * The default screen breakpoints are used rather than the resolved ones,
 * since the test page does not override them and `$screen-breakpoints`
 * defines the same values on the SCSS side.
 */
const VIEWPORT_AT_BREAKPOINT = Object.fromEntries(
  SCREEN_BREAKPOINT_NAMES.map((bp) => [bp, Math.max(400, DEFAULT_SCREEN_BREAKPOINTS[bp])])
) as Record<ScreenBreakpoint, number>;

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('grid: fixed'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/grid/test/fixed', config);
    });

    for (const breakpoint of SCREEN_BREAKPOINT_NAMES) {
      test(`fixed grid matches the ${breakpoint} width token`, async ({ page }) => {
        const viewportWidth = VIEWPORT_AT_BREAKPOINT[breakpoint];
        await page.setViewportSize({ width: viewportWidth, height: 800 });

        const grid = page.locator('ion-grid');
        const measuredWidth = await grid.evaluate((el) => el.getBoundingClientRect().width);

        const expected = ionGridBreakpoints[breakpoint]!.width!;
        const expectedPx = expected === '100%' ? viewportWidth : parseInt(expected, 10);

        // Allow 1px tolerance for sub-pixel rounding in the browser.
        expect(measuredWidth).toBeGreaterThanOrEqual(expectedPx - 1);
        expect(measuredWidth).toBeLessThanOrEqual(expectedPx + 1);
      });
    }
  });
});
