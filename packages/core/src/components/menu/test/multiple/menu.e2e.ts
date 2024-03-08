import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu: multiple'), () => {
    test.beforeEach(async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/18974',
      });

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

    test('should close first menu when showing another menu on same side', async ({ page }) => {
      const primaryMenu = page.locator('ion-menu#primary-menu');
      const secondaryMenu = page.locator('ion-menu#secondary-menu');

      await primaryMenu.evaluate((el: HTMLIonMenuElement) => el.open());
      await expect(primaryMenu).toBeVisible();

      await secondaryMenu.evaluate((el: HTMLIonMenuElement) => el.open());
      await expect(primaryMenu).toBeHidden();
      await expect(secondaryMenu).toBeVisible();
    });

    test('passing side to the menuController when multiple menus have that side should result in a warning', async ({
      page,
    }) => {
      const logs: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          logs.push(msg.text());
        }
      });

      await page.evaluate(() => (window as any).menuController.open('start'));

      expect(logs.length).toBe(1);
    });

    test('passing side to the menuController when multiple disabled menus have that side should result in a warning', async ({
      page,
    }) => {
      const logs: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'warning') {
          logs.push(msg.text());
        }
      });

      await page.evaluate(() => (window as any).menuController.open('end'));

      expect(logs.length).toBe(1);
    });
  });
});
