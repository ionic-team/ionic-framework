import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('overlays: focus', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should not focus the overlay container if element inside of overlay is focused', async ({ page }) => {
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

  test('should not select a hidden focusable element', async ({ page, browserName }) => {
    await page.setContent(`
      <ion-button id="open-modal">Show Modal</ion-button>
      <ion-modal trigger="open-modal">
        <ion-content>
          <ion-button hidden id="hidden">Hidden Button</ion-button>
          <ion-button id="visible">Visible Button</ion-button>
        </ion-content>
      </ion-modal>
    `);

    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const presentButton = page.locator('ion-button#open-modal');
    const visibleButton = page.locator('ion-button#visible');
    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

    await presentButton.click();
    await ionModalDidPresent.next();

    await page.keyboard.press(tabKey);
    await expect(visibleButton).toBeFocused();

    await page.keyboard.press(tabKey);
    await expect(visibleButton).toBeFocused();
  });

  test.only('should move focus to overlay when last focused element is removed from DOM', async ({
    page,
    browserName,
  }) => {
    await page.setContent(`
      <ion-button id="open-modal">Show Modal</ion-button>
      <ion-modal trigger="open-modal">
        <ion-content>
          <ion-button id="remove" onclick="remove(this)">Button</ion-button>
        </ion-content>
      </ion-modal>
      <script>
        const remove = (el) => {
          el.remove();
        }
      </script>
    `);

    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const modal = page.locator('ion-modal');
    const presentButton = page.locator('ion-button#open-modal');
    const removeButton = page.locator('ion-button#remove');
    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

    await presentButton.click();
    await ionModalDidPresent.next();

    await page.keyboard.press(tabKey);
    await expect(removeButton).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(modal).toBeFocused();
  });
});
