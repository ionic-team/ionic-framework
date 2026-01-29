import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('item: custom'), () => {
    test.describe(title('CSS shadow parts'), () => {
      test('should be able to customize native part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item::part(native) {
              background-color: red;
            }
          </style>

          <ion-item>
            <ion-label>Item</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');
        const backgroundColor = await item.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const native = shadowRoot?.querySelector('.item-native');
          return native ? window.getComputedStyle(native).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(255, 0, 0)');
      });

      test('should be able to customize inner part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item::part(inner) {
              background-color: green;
            }
          </style>

          <ion-item>
            <ion-label>Item</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');
        const backgroundColor = await item.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const inner = shadowRoot?.querySelector('.item-inner');
          return inner ? window.getComputedStyle(inner).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(0, 128, 0)');
      });

      test('should be able to customize content part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item::part(content) {
              background-color: blue;
            }
          </style>

          <ion-item>
            <ion-label>Item</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');
        const backgroundColor = await item.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const content = shadowRoot?.querySelector('.input-wrapper');
          return content ? window.getComputedStyle(content).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(0, 0, 255)');
      });

      test('should be able to customize detail-icon part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item::part(detail-icon) {
              background-color: red;
            }
          </style>

          <ion-item detail="true">
            <ion-label>Item</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');
        const backgroundColor = await item.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const detailIcon = shadowRoot?.querySelector('.item-detail-icon');
          return detailIcon ? window.getComputedStyle(detailIcon).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(255, 0, 0)');
      });
    });

    test.describe(title('CSS variables'), () => {
      test('should be able to customize background using css variables', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item {
              --background: red;
            }
          </style>

          <ion-item>
            <ion-label>Item</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');
        const backgroundColor = await item.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const native = shadowRoot?.querySelector('.item-native');
          return native ? window.getComputedStyle(native).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(255, 0, 0)');
      });

      test('should be able to customize padding using css variables', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-item {
              --padding-top: 20px;
              --padding-bottom: 20px;
              --padding-start: 10px;
              --padding-end: 10px;
            }
          </style>

          <ion-item>
            <ion-label>Item</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');
        const paddingValues = await item.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const native = shadowRoot?.querySelector('.item-native');
          return {
            paddingTop: native ? window.getComputedStyle(native).paddingTop : '',
            paddingBottom: native ? window.getComputedStyle(native).paddingBottom : '',
            paddingStart: native ? window.getComputedStyle(native).paddingLeft : '',
            paddingEnd: native ? window.getComputedStyle(native).paddingRight : '',
          };
        });
        expect(paddingValues.paddingTop).toBe('20px');
        expect(paddingValues.paddingBottom).toBe('20px');
        expect(paddingValues.paddingStart).toBe('10px');
        expect(paddingValues.paddingEnd).toBe('10px');
      });
    });
  });
});
