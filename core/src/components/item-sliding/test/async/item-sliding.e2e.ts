import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('item-sliding: async'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/async`, config);
      const toggleButton = page.locator('#toggle-button');

      await toggleButton.click();
      await expect(toggleButton).toHaveClass(/hidden/); // class is added when everything is ready
    });

    test('should open even when ion-item is added async', async ({ page }) => {
      const itemSlidingEl = page.locator('#async-item');
      const itemEl = itemSlidingEl.locator('ion-item');

      // Click item to open ion-item-sliding
      await itemEl.click();

      // This class is added when the item sliding component is fully open
      await expect(itemSlidingEl).toHaveClass(/item-sliding-active-slide/);
    });

    test('should open when ion-item-options are added async', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/25578',
      });

      const itemSlidingEl = page.locator('#async-options-added');
      const itemEl = itemSlidingEl.locator('ion-item');

      await itemEl.click();

      await expect(itemSlidingEl).toHaveClass(/item-sliding-active-slide/);
    });

    // NOTE: This test uses the CDN version of Ionic.
    // If this test fails, it is likely due to a regression in the published package.
    test('should not throw errors when adding multiple items with side="end" using the Ionic CDN', async ({
      page,
    }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29499',
      });

      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      page.on('pageerror', (error) => {
        errors.push(error.message);
      });

      // This issue only happens when using a CDN version of Ionic
      // so we need to use the CDN by passing the `importIonicFromCDN` option
      // to setContent.
      await page.setContent(
        `
        <ion-header>
          <ion-toolbar>
            <ion-title>Item Sliding</ion-title>
            <ion-buttons slot="end">
              <ion-button id="addItem" onclick="addItem()">ADD ITEM</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list id="list"></ion-list>
        </ion-content>

        <script>
          let itemList = [];
          function generateItem() {
            const currentItem = itemList.length + 1;
            const item = \`
              <ion-item-sliding>
                <ion-item>
                  <ion-label>Sliding Item \${currentItem}</ion-label>
                </ion-item>
                <ion-item-options side="end">
                  <ion-item-option>Delete</ion-item-option>
                </ion-item-options>
              </ion-item-sliding>
            \`;
            itemList.push(item);
            return item;
          }
          function addItem() {
            const list = document.getElementById('list');
            list.innerHTML += generateItem();
            const currentItem = itemList.length;
          }
        </script>
      `,
        { ...config, importIonicFromCDN: true }
      );

      // Click the button enough times to reproduce the issue
      const addButton = page.locator('#addItem');
      await addButton.click();
      await addButton.click();
      await addButton.click();

      await page.waitForChanges();

      // Check that the items have been added
      const items = page.locator('ion-item-sliding');
      expect(await items.count()).toBe(3);

      // Check that no errors have been logged
      expect(errors.length).toBe(0);
    });
  });
});
