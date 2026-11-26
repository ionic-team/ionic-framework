import { expect } from '@playwright/test';
import { configs, dragElementBy, test } from '@utils/test/playwright';

/**
 * Reorder group does not have per-mode styles
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('reorder group: basic'), () => {
    test('should render the handle when reorder group is enabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-reorder-group disabled="false">
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
        </ion-reorder-group>
      `,
        config
      );
      const reorder = page.locator('ion-reorder');
      await expect(reorder).toBeVisible();
    });
    test('should not render the handle when reorder group is disabled', async ({ page }) => {
      await page.setContent(
        `
        <ion-reorder-group disabled="true">
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-reorder slot="end"></ion-reorder>
          </ion-item>
        </ion-reorder-group>
      `,
        config
      );
      const reorder = page.locator('ion-reorder');
      await expect(reorder).toBeHidden();
    });

    test.describe('fractional item heights', () => {
      test.beforeEach(async ({ page }, testInfo) => {
        testInfo.annotations.push({
          type: 'issue',
          description: 'https://github.com/ionic-team/ionic-framework/issues/31670',
        });

        await page.setContent(
          `
          <style>
            .row {
              height: 20.5px;
            }
          </style>
          <ion-reorder-group disabled="false">
            ${'<div class="row"><ion-reorder>Item</ion-reorder></div>'.repeat(30)}
          </ion-reorder-group>
        `,
          config
        );
      });

      test('should swap at the item boundaries further down the list', async ({ page }) => {
        const rows = page.locator('.row');
        const ionReorderEnd = await page.spyOnEvent('ionReorderEnd');

        const firstRow = (await rows.nth(0).boundingBox())!;
        const targetRow = (await rows.nth(25).boundingBox())!;
        const x = firstRow.x + firstRow.width / 2;
        const targetY = targetRow.y + targetRow.height / 2;

        // Drag the center of the first row to the center of the target row.
        await dragElementBy(
          page.locator('ion-reorder').first(),
          page,
          0,
          targetRow.y - firstRow.y,
          x,
          undefined,
          false
        );

        // The gesture ignores a move that arrives before the previous one was handled, so repeat the last one.
        await page.evaluate(() => new Promise(requestAnimationFrame));
        await page.mouse.move(x, targetY);
        await page.evaluate(() => new Promise(requestAnimationFrame));

        await page.mouse.up();
        await page.waitForChanges();

        await expect(ionReorderEnd).toHaveReceivedEventDetail({ from: 0, to: 25, complete: undefined });
      });

      test('should move the displaced items by the exact height of the selected item', async ({ page }) => {
        const rows = page.locator('.row');

        await dragElementBy(page.locator('ion-reorder').first(), page, 0, 40, undefined, undefined, false);
        await page.waitForChanges();

        await expect(rows.nth(1)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -20.5)');
      });
    });
  });
});
