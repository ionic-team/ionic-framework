import { configs, test } from '@utils/test/playwright';

import { testSlidingItem } from '../test.utils';

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
