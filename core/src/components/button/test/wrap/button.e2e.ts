import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

const LONG_TEXT =
  'This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends';

const ICONS_TEXT = `
  <ion-icon slot="start" name="heart"></ion-icon>
  ${LONG_TEXT}
  <ion-icon slot="end" name="star"></ion-icon>
`;

const styles = `
  <style>
    .wrap-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  </style>
`;

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: wrap'), () => {
    test('should render buttons with long text', async ({ page }) => {
      await page.setContent(
        `
        ${styles}

        <div class="wrap-container">
          <ion-button>${LONG_TEXT}</ion-button>
          <ion-button size="small">${LONG_TEXT}</ion-button>
          <ion-button size="large">${LONG_TEXT}</ion-button>
          <ion-button>${ICONS_TEXT}</ion-button>
          <ion-button expand="block">${LONG_TEXT}</ion-button>
          <ion-button expand="block">${ICONS_TEXT}</ion-button>
          <ion-button expand="full">${LONG_TEXT}</ion-button>
          <ion-button expand="full">${ICONS_TEXT}</ion-button>
        </div>
      `,
        config
      );

      const container = page.locator('.wrap-container');

      await expect(container).toHaveScreenshot(screenshot(`button-wrap`));
    });

    test('should render buttons with long text inside parents', async ({ page }) => {
      await page.setContent(
        `
        ${styles}

        <div class="wrap-container">
          <ion-item>
            <ion-button slot="end">${LONG_TEXT}</ion-button>
          </ion-item>
          <ion-item>
            <ion-button slot="end">${ICONS_TEXT}</ion-button>
          </ion-item>
          <ion-list-header>
            <ion-label>List Header</ion-label>
            <ion-button>${LONG_TEXT}</ion-button>
          </ion-list-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button>${LONG_TEXT}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </div>
      `,
        config
      );

      const container = page.locator('.wrap-container');

      await expect(container).toHaveScreenshot(screenshot(`button-wrap-in-parents`));
    });
  });
});
