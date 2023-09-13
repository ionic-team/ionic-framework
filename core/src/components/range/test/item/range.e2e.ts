import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('range: item'), () => {
    test('should render correctly in list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-range><div slot="label">Temperature</div></ion-range>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`range-list`));
    });
    test('should render correctly in inset list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-range><div slot="label">Temperature</div></ion-range>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`range-inset-list`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('range: item color'), () => {
    test('label should have correct contrast when used in an item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item color="danger">
          <ion-range><div slot="label">Temperature</div></ion-range>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      await expect(item).toHaveScreenshot(screenshot(`range-item-color`));
    });
  });
});

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config, screenshot }) => {
  test.describe(title('range: stacked label in item'), () => {
    test('should render margins correctly when using stacked label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-item>
              <ion-range label="Temperature" label-placement="stacked"></ion-range>
            </ion-item>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      await expect(list).toHaveScreenshot(screenshot(`range-stacked-label-in-item`));
    });
  });
});
