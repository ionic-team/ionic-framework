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
    for (const breakpoint of SCREEN_BREAKPOINT_NAMES) {
      test(`fixed grid matches the ${breakpoint} width token`, async ({ page }) => {
        const viewportWidth = VIEWPORT_AT_BREAKPOINT[breakpoint];

        // Size the viewport before loading so the first render already
        // resolves to this breakpoint. Resizing an open page would instead
        // depend on the re-render landing before the measurement below.
        await page.setViewportSize({ width: viewportWidth, height: 800 });
        await page.goto('/src/components/grid/test/fixed', config);

        const grid = page.locator('ion-grid');

        // Assert the breakpoint before measuring. A grid that has not resolved
        // one yet still has the xs token applied, which is 100%, so the width
        // assertion below would fail with the viewport width instead of
        // naming the breakpoint.
        await expect(grid).toHaveAttribute('screen-breakpoint', breakpoint);

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
