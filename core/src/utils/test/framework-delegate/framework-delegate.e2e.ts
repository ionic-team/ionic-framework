import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('framework-delegate'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/utils/test/framework-delegate', config);
    });
    test('should present modal already at ion-app root', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#button-inline-root');

      const modal = page.locator('#inline-root');
      await ionModalDidPresent.next();
      await expect(modal).toBeVisible();
    });

    test('should present modal in content', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#button-inline-content');

      const modal = page.locator('#inline-content');
      await ionModalDidPresent.next();
      await expect(modal).toBeVisible();
    });

    test('should present modal via controller', async ({ page }) => {
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#button-controller');

      const modal = page.locator('#controller');
      await ionModalDidPresent.next();
      await expect(modal).toBeVisible();
    });
  });
});
