import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: item'), () => {
    test('should render correctly in list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-select
              label="Email"
              value="apple"
            >
              <ion-select-option value="apple">Apple</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`select-list-no-fill`));
    });
    test('should render correctly in inset list with no fill', async ({ page }) => {
      await page.setContent(
        `
        <ion-list inset="true">
          <ion-item>
            <ion-select
              label="Fruit"
              value="apple"
            >
              <ion-select-option value="apple">Apple</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>
      `,
        config
      );
      const list = page.locator('ion-list');
      expect(await list.screenshot()).toMatchSnapshot(screenshot(`select-inset-list-no-fill`));
    });
  });
});
