import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('overlays: focus', () => {
  test('should not focus the overlay container if element inside of overlay is focused', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-button id="open-modal">Show Modal</ion-button>
      <ion-modal trigger="open-modal">
        <ion-content>
          <ion-input autofocus="true"></ion-input>
        </ion-content>
      </ion-modal>
    `);

    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const button = page.locator('ion-button');
    const input = page.locator('ion-input');

    await button.click();
    await input.evaluate((el: HTMLIonInputElement) => el.setFocus());

    await ionModalDidPresent.next();
    await page.waitForChanges();

    await expect(page.locator('ion-input input')).toBeFocused();
  });
});
