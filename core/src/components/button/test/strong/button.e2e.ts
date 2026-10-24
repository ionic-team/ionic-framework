import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Clear buttons have special font-weight
 * styles which is why we make sure
 * to capture the clear button here.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: strong'), () => {
    test('should render strong buttons', async ({ page }) => {
      await page.setContent(
        `
        <style>
          .strong-container {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 10px;
            padding: 6px;
          }
        </style>

        <div class="strong-container">
          <ion-button fill="solid" strong="true">Button</ion-button>
          <ion-button fill="clear" strong="true">Button</ion-button>
          <ion-buttons>
            <ion-button strong="true" fill="solid">Button</ion-button>
          </ion-buttons>
          <ion-buttons>
            <ion-button strong="true" fill="clear">Button</ion-button>
          </ion-buttons>
        </div>
      `,
        config
      );

      const container = page.locator('.strong-container');

      await expect(container).toHaveScreenshot(screenshot(`button-strong`));
    });
  });
});
