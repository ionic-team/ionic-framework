import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('item-option: custom'), () => {
    test.describe(title('CSS shadow parts'), () => {
      test('should be able to customize native part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item-option::part(native) {
              background-color: red;
            }
          </style>

          <ion-item-option>Option</ion-item-option>
        `,
          config
        );

        const itemOption = page.locator('ion-item-option');
        const backgroundColor = await itemOption.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const native = shadowRoot?.querySelector('.button-native');
          return native ? window.getComputedStyle(native).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(255, 0, 0)');
      });

      test('should be able to customize inner part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item-option::part(inner) {
              background-color: green;
            }
          </style>

          <ion-item-option>Option</ion-item-option>
        `,
          config
        );

        const itemOption = page.locator('ion-item-option');
        const backgroundColor = await itemOption.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const inner = shadowRoot?.querySelector('.button-inner');
          return inner ? window.getComputedStyle(inner).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(0, 128, 0)');
      });

      test('should be able to customize container part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item-option::part(container) {
              background-color: blue;
            }
          </style>

          <ion-item-option>Option</ion-item-option>
        `,
          config
        );

        const itemOption = page.locator('ion-item-option');
        const backgroundColor = await itemOption.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const container = shadowRoot?.querySelector('.horizontal-wrapper');
          return container ? window.getComputedStyle(container).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(0, 0, 255)');
      });
    });
  });
});
