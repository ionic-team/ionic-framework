import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: item with list'), () => {
    test('should render correctly in list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-checkbox>Enable Notifications</ion-checkbox>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`checkbox-list`));
    });
    test('should render correctly in inset list', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-checkbox>Enable Notifications</ion-checkbox>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`checkbox-inset-list`));
    });
  });
});

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: label in item'), () => {
    test('label should have correct contrast when used in an item', async ({ page }) => {
      await page.setContent(
        `
        <ion-item color="primary">
          <ion-checkbox>Enable Notifications</ion-checkbox>
        </ion-item>
      `,
        config
      );
      const item = page.locator('ion-item');
      expect(await item.screenshot()).toMatchSnapshot(screenshot(`checkbox-item-color`));
    });
  });
});

configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: long label in item'), () => {
    test('should render margins correctly when using long label in item', async ({ page }) => {
      await page.setContent(
        `
          <ion-list>
            <ion-item>
              <ion-checkbox justify="start">
                <ion-label class="ion-text-wrap">Enable Notifications Enable Notifications Enable Notifications</ion-label>
              </ion-checkbox>
            </ion-item>
          </ion-list>
        `,
        config
      );
      const list = page.locator('ion-list');
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`checkbox-long-label-in-item`));
    });
  });
});
