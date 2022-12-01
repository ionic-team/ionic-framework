import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('menu: focus trap', () => {
    test.beforeEach(async ({ page, skip }) => {
      skip.browser('firefox', 'Firefox incorrectly allows keyboard focus to move to ion-content');

      await page.goto(`/src/components/menu/test/focus-trap`, config);
    });

    test(title('should trap focus'), async ({ page, browserName }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');

      await page.click('#open-menu-button');
      await ionDidOpen.next();

      const button = await page.locator('#open-modal-button');

      if (browserName === 'webkit') {
        await page.keyboard.down('Alt');
      }

      await page.keyboard.press('Tab');

      await expect(button).toBeFocused();

      await page.keyboard.press('Tab');

      if (browserName === 'webkit') {
        await page.keyboard.up('Alt');
      }

      await expect(button).toBeFocused();
    });

    test(title('should trap focus with overlays'), async ({ page, browserName }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#open-menu-button');
      await ionDidOpen.next();

      const menu = await page.locator('#menu');
      await expect(menu).toBeFocused();

      const openModalButton = await page.locator('#open-modal-button');
      await openModalButton.click();
      await ionModalDidPresent.next();

      const modal = await page.locator('#modal');
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

    test(title('should trap focus with content inside overlays'), async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#open-menu-button');
      await ionDidOpen.next();

      const menu = await page.locator('#menu');
      await expect(menu).toBeFocused();

      await page.click('#open-modal-button');
      await ionModalDidPresent.next();

      const modal = await page.locator('#modal');
      await expect(modal).toBeFocused();
    });

    test(title('should work with swipe gestures after modal is dismissed'), async ({ page }) => {
      const ionDidOpen = await page.spyOnEvent('ionDidOpen');
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
      const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

      await page.click('#open-menu-button');
      await ionDidOpen.next();

      const menu = await page.locator('#menu');
      await expect(menu).toBeFocused();

      await page.click('#open-modal-button');
      await ionModalDidPresent.next();

      const modal = await page.locator('#modal');

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
