import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { defaultTheme as mdTheme } from '../../../../themes/md/default.tokens';
import { SIZE_TO_MEDIA } from '../../../../utils/media';
import { ION_GRID_BREAKPOINTS } from '../../grid.interface';

const ionGridBreakpoints = mdTheme.components!.IonGrid!.breakpoint!;

/**
 * Parse the min-width (in px) out of each `SIZE_TO_MEDIA` entry. These are
 * the same activation thresholds `matchBreakpoint` evaluates at runtime and
 * that `$screen-breakpoints` defines on the SCSS side.
 */
const minWidthFor = (bp: (typeof ION_GRID_BREAKPOINTS)[number]): number => {
  const match = (SIZE_TO_MEDIA[bp] as string).match(/\(min-width:\s*(\d+)px\)/);
  return match ? parseInt(match[1], 10) : 0;
};

/**
 * Viewport width that activates each breakpoint. `max(400, minWidth)` lands
 * exactly on the threshold for sm/md/lg/xl (firing only that breakpoint's
 * rule and nothing above it) while giving xs a renderable non-zero viewport.
 */
const VIEWPORT_AT_BREAKPOINT = Object.fromEntries(
  ION_GRID_BREAKPOINTS.map((bp) => [bp, Math.max(400, minWidthFor(bp))])
) as Record<(typeof ION_GRID_BREAKPOINTS)[number], number>;

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('grid: fixed'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/grid/test/fixed', config);
    });

    for (const breakpoint of ION_GRID_BREAKPOINTS) {
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
