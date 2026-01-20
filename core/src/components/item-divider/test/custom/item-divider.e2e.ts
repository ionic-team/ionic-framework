import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('item-divider: custom'), () => {
    test.describe(title('CSS shadow parts'), () => {
      test('should be able to customize inner part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item-divider::part(inner) {
              background-color: red;
            }
          </style>

          <ion-item-divider>Divider</ion-item-divider>
        `,
          config
        );

        const divider = page.locator('ion-item-divider');
        const backgroundColor = await divider.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const inner = shadowRoot?.querySelector('.item-divider-inner');
          return inner ? window.getComputedStyle(inner).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(255, 0, 0)');
      });

      test('should be able to customize content part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item-divider::part(content) {
              background-color: green;
            }
          </style>

          <ion-item-divider>Divider</ion-item-divider>
        `,
          config
        );

        const divider = page.locator('ion-item-divider');
        const backgroundColor = await divider.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const content = shadowRoot?.querySelector('.item-divider-wrapper');
          return content ? window.getComputedStyle(content).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(0, 128, 0)');
      });
    });
  });
});
