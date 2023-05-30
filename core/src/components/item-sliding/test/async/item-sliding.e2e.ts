import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('item-sliding: async'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/async`, config);

      await page.click('#toggle-button');
      await page.waitForChanges();
    });

    test('should open even when item is added async', async ({ page }) => {
      const itemSlidingEl = page.locator('#async-item');
      const itemEl = itemSlidingEl.locator('ion-item');

      // Click item to open ion-item-sliding
      await itemEl.click();

      // This class is added when the item sliding component is fully open
      await expect(itemSlidingEl).toHaveClass(/item-sliding-active-slide/);
    });

    test('should open when options are added async', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25578',
      });

      const itemSlidingEl = page.locator('#async-options-added');
      const itemEl = itemSlidingEl.locator('ion-item');

      await itemEl.click();

      await expect(itemSlidingEl).toHaveClass(/item-sliding-active-slide/);
    });

    test('should not open when options are removed async', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25578#issuecomment-1520779848',
      });

      const itemSlidingEl = page.locator('#async-options-removed');
      const boundingBox = await itemSlidingEl.boundingBox();

      await itemSlidingEl.hover();
      await page.mouse.down();
      await page.mouse.move(boundingBox!.x, boundingBox!.y);
      // don't release mouse, since active class is removed then even when bug occurs

      await expect(itemSlidingEl).not.toHaveClass(/item-sliding-active-slide/);
    });
  });
});
