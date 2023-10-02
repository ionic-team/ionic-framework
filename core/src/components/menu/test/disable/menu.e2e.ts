import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu: disable'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/menu/test/basic`, config);
    });

    test('should disable when menu is fully open', async ({ page }) => {
      const menu = page.locator('ion-menu');

      // Should be visible on initial presentation
      await menu.evaluate((el: HTMLIonMenuElement) => el.open());
      await expect(menu).toBeVisible();

      // Disabling menu should hide it
      await menu.evaluate((el: HTMLIonMenuElement) => (el.disabled = true));
      await expect(menu).toBeHidden();

      // Re-enabling menu and opening it show make it visible
      await menu.evaluate((el: HTMLIonMenuElement) => (el.disabled = false));
      await menu.evaluate((el: HTMLIonMenuElement) => el.open());
      await expect(menu).toBeVisible();
    });

    test('should disable when menu is animating', async ({ page }) => {
      const menu = page.locator('ion-menu');

      // Opening and quickly disabling menu should hide it
      menu.evaluate((el: HTMLIonMenuElement) => el.open());
      await menu.evaluate((el: HTMLIonMenuElement) => (el.disabled = true));
      await expect(menu).toBeHidden();

      // Re-enabling menu and opening it show make it visible
      await menu.evaluate((el: HTMLIonMenuElement) => (el.disabled = false));
      await menu.evaluate((el: HTMLIonMenuElement) => el.open());
      await expect(menu).toBeVisible();
    });
  });
});
