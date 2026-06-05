import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: sizes'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/grid/test/sizes`, config);

      await page.setIonViewport();
    });

    test('should not have visual regressions for responsive sm columns', async ({ page }) => {
      const grid = page.locator('#responsive-sm');

      await expect(grid).toHaveScreenshot(screenshot('grid-sizes-responsive-sm'));
    });

    test('should not have visual regressions for auto sized columns', async ({ page }) => {
      const grid = page.locator('#size-auto');

      await expect(grid).toHaveScreenshot(screenshot('grid-sizes-size-auto'));
    });

    test('should not have visual regressions for breakpoint sizes', async ({ page }) => {
      const breakpointSizes = page.locator('#breakpoint-sizes');

      await expect(breakpointSizes).toHaveScreenshot(screenshot('grid-sizes-breakpoint-sizes'));
    });

    test('should size each column to its fraction of a 10 column grid', async ({ page }) => {
      const { rowWidth, columns } = await page.locator('#ten-column-layout ion-row').evaluate((row) => {
        const cols = Array.from(row.querySelectorAll('ion-col'));

        return {
          rowWidth: row.clientWidth,
          columns: cols.map((col) => ({
            size: Number(col.getAttribute('size')),
            width: col.getBoundingClientRect().width,
          })),
        };
      });

      // The grid overrides columns to 10, so one column unit is rowWidth / 10
      const columnUnit = rowWidth / 10;

      for (const column of columns) {
        expect(column.width).toBeCloseTo(columnUnit * column.size, 0);
      }
    });
  });
});
