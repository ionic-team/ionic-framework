import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, config }) => {
  test.describe(title('list-header: custom'), () => {
    test.describe(title('CSS shadow parts'), () => {
      test('should be able to customize inner part', async ({ page }) => {
        await page.setContent(
          `
          <style>
            ion-list-header::part(inner) {
              background-color: red;
            }
          </style>

          <ion-list-header>Header</ion-list-header>
        `,
          config
        );

        const header = page.locator('ion-list-header');
        const backgroundColor = await header.evaluate((el) => {
          const shadowRoot = el.shadowRoot;
          const inner = shadowRoot?.querySelector('.list-header-inner');
          return inner ? window.getComputedStyle(inner).backgroundColor : '';
        });
        expect(backgroundColor).toBe('rgb(255, 0, 0)');
      });
    });
  });
});
