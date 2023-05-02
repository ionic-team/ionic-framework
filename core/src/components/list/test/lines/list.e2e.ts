import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('list: lines'), () => {
    test('lines="full" should render correctly', async ({ page }) => {
      await page.goto(`/src/components/list/test/lines`, config);

      const list = page.locator('ion-list[lines="full"]');

      await expect(list).toHaveScreenshot(screenshot(`list-lines-full`));
    });
    test('lines="inset" should render correctly', async ({ page }) => {
      await page.goto(`/src/components/list/test/lines`, config);

      const list = page.locator('ion-list[lines="inset"]');

      await expect(list).toHaveScreenshot(screenshot(`list-lines-inset`));
    });
    test('lines="none" should render correctly', async ({ page }) => {
      await page.goto(`/src/components/list/test/lines`, config);

      const list = page.locator('ion-list[lines="none"]');

      await expect(list).toHaveScreenshot(screenshot(`list-lines-none`));
    });
  });
});
