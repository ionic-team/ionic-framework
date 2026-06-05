import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes.
 */
configs({ modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('grid: padding'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/grid/test/padding`, config);

      await page.setIonViewport();
    });

    test('should not have visual regressions for a nested grid', async ({ page }) => {
      const grid = page.locator('#no-grid-padding-nested');

      await expect(grid).toHaveScreenshot(screenshot('grid-padding-nested'));
    });

    test('should not have visual regressions for default padding', async ({ page }) => {
      const grid = page.locator('#default-grid-padding');

      await expect(grid).toHaveScreenshot(screenshot('grid-padding-default'));
    });

    test('should remove all padding with the no padding utility', async ({ page }) => {
      const padding = await page.locator('#no-grid-padding').evaluate((grid) => {
        const styles = getComputedStyle(grid);

        return {
          top: styles.paddingTop,
          end: styles.paddingInlineEnd,
          bottom: styles.paddingBottom,
          start: styles.paddingInlineStart,
        };
      });

      expect(padding).toEqual({ top: '0px', end: '0px', bottom: '0px', start: '0px' });
    });

    test('should apply custom grid padding from the breakpoint variables', async ({ page }) => {
      const padding = await page.locator('#custom-grid-padding').evaluate((grid) => {
        const styles = getComputedStyle(grid);

        return {
          top: styles.paddingTop,
          end: styles.paddingInlineEnd,
          bottom: styles.paddingBottom,
          start: styles.paddingInlineStart,
        };
      });

      // At the mobile (xs) viewport the custom grid padding is 0 on every side
      expect(padding).toEqual({ top: '0px', end: '0px', bottom: '0px', start: '0px' });
    });

    test('should apply custom column padding from the breakpoint variables', async ({ page }) => {
      const padding = await page
        .locator('#custom-column-padding ion-col')
        .first()
        .evaluate((col) => {
          const styles = getComputedStyle(col);

          return {
            top: styles.paddingTop,
            end: styles.paddingInlineEnd,
            bottom: styles.paddingBottom,
            start: styles.paddingInlineStart,
          };
        });

      // At the mobile (xs) viewport the custom column padding is 2px on every side
      expect(padding).toEqual({ top: '2px', end: '2px', bottom: '2px', start: '2px' });
    });
  });
});
