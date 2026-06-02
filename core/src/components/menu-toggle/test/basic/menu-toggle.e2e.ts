import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu-toggle: basic'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/menu-toggle/test/basic`, config);
    });

    test('should open selected menu by side', async ({ page }) => {
      const startMenu = page.locator('[menu-id="start-menu"]');
      const endMenu = page.locator('[menu-id="end-menu"]');
      const menuToggle = page.locator('ion-menu-toggle');

      // do this outside testMenu since passing params to eval callback is tricky due to execution context
      await menuToggle.evaluate((el: HTMLIonMenuToggleElement) => (el.menu = 'start'));
      await testMenu(page, startMenu);

      await menuToggle.evaluate((el: HTMLIonMenuToggleElement) => (el.menu = 'end'));
      await testMenu(page, endMenu);
    });

    test('should open selected menu by menu-id', async ({ page }) => {
      const startMenu = page.locator('[menu-id="start-menu"]');
      const endMenu = page.locator('[menu-id="end-menu"]');
      const menuToggle = page.locator('ion-menu-toggle');

      // do this outside testMenu since passing params to eval callback is tricky due to execution context
      await menuToggle.evaluate((el: HTMLIonMenuToggleElement) => (el.menu = 'start-menu'));
      await testMenu(page, startMenu);

      await menuToggle.evaluate((el: HTMLIonMenuToggleElement) => (el.menu = 'end-menu'));
      await testMenu(page, endMenu);
    });

    test('should hide when resolving visibility rejects', async ({ page }) => {
      const startMenu = page.locator('[menu-id="start-menu"]');
      const menuToggle = page.locator('ion-menu-toggle');

      /*
       * Without a `menu`, visibility resolves to whichever menu registered
       * first, which can vary between runs and produces flaky results.
       */
      await menuToggle.evaluate((el: HTMLIonMenuToggleElement) => (el.menu = 'start-menu'));

      // The toggle starts visible because the resolved menu is active
      await expect(menuToggle).not.toHaveClass(/menu-toggle-hidden/);

      /*
       * Force the visibility check to reject by making the resolved menu's
       * `isActive()` throw. `isActive` is a non-writable @Method, so shadow
       * it with `defineProperty`.
       */
      await startMenu.evaluate((el: HTMLIonMenuElement) => {
        Object.defineProperty(el, 'isActive', {
          value: () => Promise.reject(new Error('test')),
          configurable: true,
        });
      });

      // Trigger `visibilityChanged` by emitting `ionMenuChange`
      await page.evaluate(() => {
        document.body.dispatchEvent(new CustomEvent('ionMenuChange'));
      });

      await expect(menuToggle).toHaveClass(/menu-toggle-hidden/);
      await expect(menuToggle).toHaveAttribute('aria-hidden', 'true');
    });
  });
});

async function testMenu(page: E2EPage, menu: Locator) {
  const ionDidOpen = await page.spyOnEvent('ionDidOpen');
  const ionDidClose = await page.spyOnEvent('ionDidClose');

  await page.click('ion-menu-toggle');
  await ionDidOpen.next();

  await expect(menu).toHaveClass(/show-menu/);

  await menu.evaluate(async (el: HTMLIonMenuElement) => {
    await el.close();
  });

  await ionDidClose.next();
}
