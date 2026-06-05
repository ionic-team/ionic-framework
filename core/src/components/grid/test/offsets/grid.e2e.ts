import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: offsets'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/grid/test/offsets`, config);

      await page.setIonViewport();
    });

    test('should shift the column by its offset count in column units', async ({ page }) => {
      const { rowWidth, offsetMargin, noOffsetMargin } = await page.locator('#offset-1 ion-row').evaluate((row) => {
        const offsetCol = row.querySelector('ion-col[offset="1"]')!;
        const noOffsetCol = row.querySelector('ion-col[offset="0"]')!;

        return {
          rowWidth: row.clientWidth,
          offsetMargin: parseFloat(getComputedStyle(offsetCol).marginInlineStart),
          noOffsetMargin: parseFloat(getComputedStyle(noOffsetCol).marginInlineStart),
        };
      });

      // One column unit is rowWidth / 12 (12 column grid, no gap).
      const columnUnit = rowWidth / 12;

      expect(offsetMargin).toBeCloseTo(columnUnit, 0);
      expect(noOffsetMargin).toBe(0);
    });

    test('should not have visual regressions for order', async ({ page }) => {
      const order = page.locator('#order');

      await expect(order).toHaveScreenshot(screenshot('grid-offsets-order'));
    });

    test('should scale the offset margin with the offset count', async ({ page }) => {
      const { rowWidth, largeOffsetMargin, smallOffsetMargin } = await page
        .locator('#offset-2 ion-row')
        .evaluate((row) => {
          const largeOffsetCol = row.querySelector('ion-col[offset="5"]')!;
          const smallOffsetCol = row.querySelector('ion-col[offset="2"]')!;

          return {
            rowWidth: row.clientWidth,
            largeOffsetMargin: parseFloat(getComputedStyle(largeOffsetCol).marginInlineStart),
            smallOffsetMargin: parseFloat(getComputedStyle(smallOffsetCol).marginInlineStart),
          };
        });

      // One column unit is rowWidth / 12 (12 column grid, no gap).
      const columnUnit = rowWidth / 12;

      expect(largeOffsetMargin).toBeCloseTo(columnUnit * 5, 0);
      expect(smallOffsetMargin).toBeCloseTo(columnUnit * 2, 0);
    });

    test('updating the offset prop updates the column margin', async ({ page }) => {
      const { rowWidth, offsetMargin } = await page.locator('#dynamic-offset ion-row').evaluate((row) => {
        const dynamicOffsetCol = row.querySelector('#dynamicOffsetCol')!;

        return {
          rowWidth: row.clientWidth,
          offsetMargin: parseFloat(getComputedStyle(dynamicOffsetCol).marginInlineStart),
        };
      });

      // One column unit is rowWidth / 12 (12 column grid, no gap).
      const columnUnit = rowWidth / 12;

      // At the mobile test viewport the base offset ("2") applies.
      expect(offsetMargin).toBeCloseTo(columnUnit * 2, 0);

      // Clicking toggles the base offset from "2" to "4".
      await page.getByRole('button', { name: 'Update Offset' }).click();

      const dynamicOffsetCol = page.locator('#dynamicOffsetCol');
      const updatedMargin = () =>
        dynamicOffsetCol.evaluate((col) => parseFloat(getComputedStyle(col).marginInlineStart));

      await expect.poll(updatedMargin).toBeCloseTo(columnUnit * 4, 0);
    });
  });
});
