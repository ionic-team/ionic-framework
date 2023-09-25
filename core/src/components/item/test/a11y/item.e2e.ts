import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('item: axe'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      await page.goto(`/src/components/item/test/a11y`, config);

      const results = await new AxeBuilder({ page })
        // TODO(FW-404): Re-enable rule once select is updated to avoid nested-interactive
        .disableRules('nested-interactive')
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('should reflect aria-label', async ({ page }) => {
      await page.setContent(
        `
        <ion-item id="item-1" aria-label="test"></ion-item>
        <ion-item id="item-2" aria-label="test" button="true"></ion-item>
      `,
        config
      );

      const item1 = page.locator('#item-1 .item-native');
      const item2 = page.locator('#item-2 .item-native');

      expect(await item1.getAttribute('aria-label')).toEqual('test');
      expect(await item2.getAttribute('aria-label')).toEqual('test');
    });
  });

  test.describe(title('item: font scaling'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item>
          <ion-label>Item</ion-label>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`item-scale`));
    });
    test('should scale slotted icons on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item>
          <ion-icon slot="start" name="star"></ion-icon>
          <ion-label>Item</ion-label>
          <ion-icon slot="end" name="flag"></ion-icon>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`item-icons-scale`));
    });
    test('should scale detail icon on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item detail="true">
          <ion-label>Item</ion-label>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`item-detail-icon-scale`));
    });
    test('should scale counter text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-item counter="true">
          <ion-label position="stacked">Counter</ion-label>
          <ion-input maxlength="20"></ion-input>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`item-counter-text-scale`));
    });
    test('should scale helper and error text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-list>
          <ion-item>
            <ion-label>Helper</ion-label>
            <ion-input></ion-input>
            <ion-note slot="helper">Helper Text</ion-note>
          </ion-item>
          <ion-item class="ion-invalid">
            <ion-label>Error</ion-label>
            <ion-input></ion-input>
            <ion-note slot="error">Error Text</ion-note>
          </ion-item>
        </ion-list>
      `,
        config
      );

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot(`item-helper-error-text-scale`));
    });
    test('should scale buttons in an item on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 310%;
          }
        </style>

        <ion-list>
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-button>Default</ion-button>
          </ion-item>
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-button size="small">Small</ion-button>
          </ion-item>
          <ion-item>
            <ion-label>Item</ion-label>
            <ion-button size="large">Large</ion-button>
          </ion-item>
        </ion-list>
      `,
        config
      );

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot(`item-buttons-scale`));
    });
  });
});
