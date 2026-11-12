import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md', 'md', 'ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: size'), () => {
    test('should render small, medium and large buttons', async ({ page }) => {
      await page.setContent(
        `
        <style>
          .sizes-container {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 10px;
            padding: 6px;
          }
        </style>

        <div class="sizes-container">
          <ion-button size="small" fill="solid">Small Button</ion-button>
          <ion-button size="medium" fill="solid">Medium Button</ion-button>
          <ion-button size="large" fill="solid">Large Button</ion-button>
          <ion-buttons>
            <ion-button size="small" fill="solid">Small Button</ion-button>
          </ion-buttons>
          <ion-buttons>
            <ion-button size="medium" fill="solid">Medium Button</ion-button>
          </ion-buttons>
          <ion-buttons>
            <ion-button size="large" fill="solid">Large Button</ion-button>
          </ion-buttons>
        </div>
      `,
        config
      );

      const container = page.locator('.sizes-container');

      await expect(container).toHaveScreenshot(screenshot(`button-size`));
    });
  });
});
