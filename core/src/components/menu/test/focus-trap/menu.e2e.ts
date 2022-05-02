import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('menu - focus-trap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/menu/test/focus-trap');
  });
  test('it should trap focus inside of the menu', async ({ page, browserName }) => {
    const ionDidOpen = await page.spyOnEvent('ionDidOpen');

    const menu = await page.locator('ion-menu');
    await menu.evaluate((el: HTMLIonMenuElement) => el.open());
    await ionDidOpen.next();

    if (browserName === 'webkit') {
      await page.keyboard.down('Alt');
    }
    await page.keyboard.press('Tab');

    const button = await page.locator('#open-modal-button');
    expect(button).toBeFocused();

    // do it again to make sure focus stays inside menu
    await page.keyboard.press('Tab');

    // Firefox seems to focus the menu not the button itself.
    if (browserName !== 'firefox') {
      expect(button).toBeFocused()
    }
  });
  test('focus trapping with modals should not interfere with menu focus trapping', async ({ page, browserName }) => {
    const ionDidOpen = await page.spyOnEvent('ionDidOpen');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

    const menu = await page.locator('ion-menu');
    await menu.evaluate((el: HTMLIonMenuElement) => el.open());
    await ionDidOpen.next();

    expect(menu).toBeFocused();

    const openModal = await page.locator('#open-modal-button');
    await openModal.click();
    await ionModalDidPresent.next();

    const modal = await page.locator('ion-modal');

    expect(modal).toBeFocused();

    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
    await ionModalDidDismiss.next();

    // WebKit does not transfer focus to buttons by default
    if (browserName !== 'webkit') {
      expect(openModal).toBeFocused();
    }
  });
  test('menu should not steal focus from active modal', async ({ page, browserName }) => {
    const ionDidOpen = await page.spyOnEvent('ionDidOpen');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    const menu = await page.locator('ion-menu');
    await menu.evaluate((el: HTMLIonMenuElement) => el.open());
    await ionDidOpen.next();

    expect(menu).toBeFocused();

    const openModal = await page.locator('#open-modal-button');
    await openModal.click();
    await ionModalDidPresent.next();

    if (browserName === 'webkit') {
      await page.keyboard.down('Alt');
    }

    // There are two buttons, so we tab twice.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const button = await page.locator('#other-button');

    expect(button).toBeFocused();

    if (browserName === 'webkit') {
      await page.keyboard.up('Alt');
    }
  })
  test('swipe gesture should still work after focus trapping modal is dismissed', async ({ page }) => {
    const ionDidOpen = await page.spyOnEvent('ionDidOpen');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');

    const menu = await page.locator('ion-menu');
    await menu.evaluate((el: HTMLIonMenuElement) => el.open());
    await ionDidOpen.next();

    const openModal = await page.locator('#open-modal-button');
    await openModal.click();
    await ionModalDidPresent.next();

    const modal = await page.locator('ion-modal');
    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
    await ionModalDidDismiss.next();

    await page.mouse.move(30, 168);
    await page.mouse.down();

    await page.mouse.move(384, 168);
    await page.mouse.up();

    await page.waitForChanges();

    expect(menu).toHaveClass(/show-menu/);
  });
});
