import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { testSlidingItem } from '../test.utils';

configs({ directions: ['ltr'], themeModes: ['light', 'dark'] }).forEach(({ title, config }) => {
  test.describe(title('item-sliding: a11y for ion-color()'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.setContent(
        `
        <main>
          <ion-item-sliding id="axe">
            <ion-item>
              <ion-label>Sliding Item with End Options</ion-label>
            </ion-item>

            <ion-item-options>
              <ion-item-option>Favorite</ion-item-option>
              <ion-item-option class="ion-activated">Activated</ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </main>
      `,
        config
      );

      await page.locator(`#axe`).evaluate(async (el: HTMLIonItemSlidingElement) => {
        await el.open('end');
      });

      await page.waitForChanges();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  });
});

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item-sliding id="fontScaling">
          <ion-item>
            <ion-label>Item Sliding</ion-label>
          </ion-item>
          <ion-item-options>
            <ion-item-option color="danger">
              <ion-icon slot="start" name="trash"></ion-icon>
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      `,
        config
      );

      await testSlidingItem(page, 'fontScaling', 'scale', screenshot);
    });
  });
});
