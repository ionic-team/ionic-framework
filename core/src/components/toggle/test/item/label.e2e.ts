import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: item'), () => {
    test('should render correctly in list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-toggle>Enable Notifications</ion-toggle>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`toggle-list`));
    });
    test('should render correctly in inset list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-toggle>Enable Notifications</ion-toggle>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`toggle-inset-list`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: item color contrast'), () => {
    test('label should have correct contrast when used in an item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item color="primary">
          <ion-toggle>Enable Notifications</ion-toggle>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      expect(await item.screenshot()).toMatchSnapshot(screenshot(`toggle-item-color`));
    });
  });
});
