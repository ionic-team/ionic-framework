import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Trapping focus is not dependent on mode/direction
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('menu: focus trap'), () => {
    test.beforeEach(async ({ page, skip }) => {
      await page.goto(`/src/components/menu/test/focus-trap`, config);

      skip.browser('firefox', 'Firefox incorrectly allows keyboard focus to move to ion-content');
    });

    test('should trap focus with overlays', async ({ page, browserName }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#open-menu-button');
      await ionDidOpen.next();

      const menu = page.locator('#menu');
      await expect(menu).toBeFocused();

      const openModalButton = page.locator('#open-modal-button');
      await openModalButton.click();
      await ionModalDidPresent.next();

      const modal = page.locator('#modal');
      await expect(modal).toBeFocused();

      await modal.evaluate(async (el: HTMLIonModalElement) => {
        await el.dismiss();
      });
      await ionModalDidDismiss.next();

      // Safari focuses the body after the modal is dismissed
      if (browserName !== 'webkit') {
        await expect(openModalButton).toBeFocused();
      }
    });

    test('should trap focus with content inside overlays', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#open-menu-button');
      await ionDidOpen.next();

      const menu = page.locator('#menu');
      await expect(menu).toBeFocused();

      await page.click('#open-modal-button');
      await ionModalDidPresent.next();

      const modal = page.locator('#modal');
      await expect(modal).toBeFocused();
    });

    test('should work with swipe gestures after modal is dismissed', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#open-menu-button');
      await ionDidOpen.next();

      const menu = page.locator('#menu');
      await expect(menu).toBeFocused();

      await page.click('#open-modal-button');
      await ionModalDidPresent.next();

      const modal = page.locator('#modal');

      await modal.evaluate(async (el: HTMLIonModalElement) => {
        await el.dismiss();
      });
      await ionModalDidDismiss.next();

      await page.mouse.move(30, 168);
      await page.mouse.down();

      await page.mouse.move(384, 168);
      await page.mouse.up();

      await page.waitForChanges();

      await expect(menu).toHaveClass(/show-menu/);
    });
    test('should return focus to the element that opened the menu when it closes', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      const openMenuButton = page.locator('#open-menu-button');
      await openMenuButton.focus();
      await page.keyboard.press('Enter');
      await ionDidOpen.next();

      await expect(page.locator('#menu')).toBeFocused();

      await page.locator('#close-menu-button').click();
      await ionDidClose.next();

      await expect(openMenuButton).toBeFocused();
    });

    test('should return focus to ion-menu-button when the menu closes', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      const menuButton = page.locator('#menu-button button');
      await menuButton.focus();
      await page.keyboard.press('Enter');
      await ionDidOpen.next();

      const menu = page.locator('#menu');
      await expect(menu).toBeFocused();

      await menu.evaluate((el: HTMLIonMenuElement) => el.close());
      await ionDidClose.next();

      await expect(menuButton).toBeFocused();
    });

    test('should not move focus if the app focused another element when the menu closed', async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionDidClose = await page.spyOnEvent('ionDidClose');

      const openMenuButton = page.locator('#open-menu-button');
      await openMenuButton.focus();
      await page.keyboard.press('Enter');
      await ionDidOpen.next();

      await page.evaluate(() => {
        const menu = document.querySelector('ion-menu')!;
        menu.addEventListener(
          'ionDidClose',
          () => {
            const menuButton = document.querySelector('#menu-button')!;
            menuButton.shadowRoot!.querySelector('button')!.focus();
          },
          { once: true }
        );
      });

      await page.locator('#close-menu-button').click();
      await ionDidClose.next();

      await expect(page.locator('#menu-button button')).toBeFocused();
    });
  });
});
