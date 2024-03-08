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
  });
});
