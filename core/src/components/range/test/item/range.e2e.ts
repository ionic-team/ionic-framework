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
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`range-list`));
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
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`range-inset-list`));
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
      expect(await item.screenshot()).toMatchSnapshot(screenshot(`range-item-color`));
    });
  });
});
