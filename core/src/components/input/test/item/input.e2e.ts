import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('input: item'), () => {
    test('should render correctly in list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-input
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter your email"
              maxlength="20"
              counter="true"
            ></ion-input>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`input-list-no-fill`));
    });
    test('should render correctly in inset list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-input
              label="Email"
              value="hi@ionic.io"
              helper-text="Enter your email"
              maxlength="20"
              counter="true"
            ></ion-input>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`input-inset-list-no-fill`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe.only(title('input: item functionality'), () => {
    test('clicking padded space within item should focus the input', async ({ page }) => {
      await page.setContent(
        `
        <ion-item>
          <ion-input label="Input"></ion-input>
        </ion-item>
      `,
        config
      );
      const itemNative = page.locator('.item-native');
      const input = page.locator('ion-input input');

      // Clicks the padded space within the item
      await itemNative.click({
        position: {
          x: 5,
          y: 5,
        },
      });

      await expect(input).toBeFocused();
    });
  });
});
