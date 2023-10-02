import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu: disable'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/menu/test/multiple`, config);
    });

    test('should present each menu on the same side individually', async ({ page }) => {
      const primaryMenu = page.locator('ion-menu#primary-menu');
      const secondaryMenu = page.locator('ion-menu#secondary-menu');

      await primaryMenu.evaluate((el: HTMLIonMenuElement) => el.open());
      await expect(primaryMenu).toBeVisible();

      await primaryMenu.evaluate((el: HTMLIonMenuElement) => el.close());
      await expect(primaryMenu).toBeHidden();

      await secondaryMenu.evaluate((el: HTMLIonMenuElement) => el.open());
      await expect(secondaryMenu).toBeVisible();

      await secondaryMenu.evaluate((el: HTMLIonMenuElement) => el.close());
      await expect(secondaryMenu).toBeHidden();
    });

    test('should log a warning when trying to present multiple menus on the same side', async ({ page }) => {
      const logs: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          logs.push(msg.text());
        }
      });

      const primaryMenu = page.locator('ion-menu#primary-menu');
      const secondaryMenu = page.locator('ion-menu#secondary-menu');

      await primaryMenu.evaluate((el: HTMLIonMenuElement) => el.open());
      await secondaryMenu.evaluate((el: HTMLIonMenuElement) => el.open());

      expect(logs.length).toBe(1);
    });
  });
});
