import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, title }) => {
  test.describe(title('accordion: a11y'), () => {
    test('accordions should be keyboard navigable', async ({ page, skip, browserName }) => {
      // TODO(FW-1764): remove skip once issue is resolved
      skip.browser('firefox', 'https://github.com/ionic-team/ionic-framework/issues/25070');
      // TODO (FW-2979)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

      await page.goto(`/src/components/accordion/test/a11y`, config);
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

      const personalInfoHeader = page.locator('ion-accordion:first-child > ion-item');
      const billingAddressHeader = page.locator('ion-accordion:nth-child(2) > ion-item');
      const shippingAddressHeader = page.locator('ion-accordion:nth-child(3) > ion-item');
      const addressInput = page.locator('#address1 input');

      await page.keyboard.press(tabKey);
      await expect(personalInfoHeader).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(billingAddressHeader).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(shippingAddressHeader).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(personalInfoHeader).toBeFocused();

      await page.keyboard.press('ArrowUp');
      await expect(shippingAddressHeader).toBeFocused();

      // open Shipping Address accordion and move focus to the input inside it
      await page.keyboard.press('Enter');
      await page.waitForChanges();
      await page.keyboard.press(tabKey);
      await expect(addressInput).toBeFocused();

      // ensure keyboard interaction doesn't move focus from body
      await page.keyboard.press('ArrowDown');
      await expect(addressInput).toBeFocused();
    });
  });
});
