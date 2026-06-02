import { expect } from '@playwright/test';
import type { E2ELocator } from '@utils/test/playwright';
import { configs, test } from '@utils/test/playwright';

const DISABLED_OPTION_INTERFACES = [
  {
    name: 'action-sheet',
    overlayTag: 'ion-action-sheet',
    didPresent: 'ionActionSheetDidPresent',
    didDismiss: 'ionActionSheetDidDismiss',
    // The option itself is the interactive button.
    controlSuffix: '',
  },
  {
    name: 'alert',
    overlayTag: 'ion-alert',
    didPresent: 'ionAlertDidPresent',
    didDismiss: 'ionAlertDidDismiss',
    // The option itself is the interactive radio button.
    controlSuffix: '',
  },
  {
    name: 'popover',
    overlayTag: 'ion-popover',
    didPresent: 'ionPopoverDidPresent',
    didDismiss: 'ionPopoverDidDismiss',
    // The interactive control is the nested ion-radio.
    controlSuffix: ' ion-radio',
  },
  {
    name: 'modal',
    overlayTag: 'ion-modal',
    didPresent: 'ionModalDidPresent',
    didDismiss: 'ionModalDidDismiss',
    // The interactive control is the nested ion-radio.
    controlSuffix: ' ion-radio',
  },
] as const;

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('select: disabled options'), () => {
    for (const { name, overlayTag, didPresent, didDismiss, controlSuffix } of DISABLED_OPTION_INTERFACES) {
      test(`${name}: clicking a disabled option should not change the value or dismiss the overlay`, async ({
        page,
      }) => {
        await page.setContent(
          `
          <ion-select aria-label="Fruit" interface="${name}">
            <ion-select-option value="oranges" disabled="true">Oranges</ion-select-option>
          </ion-select>
        `,
          config
        );

        const select = page.locator('ion-select') as E2ELocator;

        const ionChange = await select.spyOnEvent('ionChange');
        const ionDidPresent = await page.spyOnEvent(didPresent);
        const ionDidDismiss = await page.spyOnEvent(didDismiss);

        await select.click();

        await ionDidPresent.next();

        const overlay = page.locator(overlayTag);
        const disabledOption = overlay.locator(`.select-interface-option${controlSuffix}`);

        await disabledOption.click({ force: true });

        await page.waitForChanges();

        const value = await select.evaluate((el: HTMLIonSelectElement) => el.value);
        expect(value).toBeUndefined();

        expect(ionChange).toHaveReceivedEventTimes(0);
        expect(ionDidDismiss).toHaveReceivedEventTimes(0);
        await expect(overlay).toBeVisible();
      });
    }

    test('should not focus a disabled option when no value is set', async ({ page, skip }) => {
      // TODO (ROU-5437)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/28284',
      });

      await page.setContent(
        `
        <ion-select aria-label="Select" interface="popover">
          <ion-select-option value="a" disabled="true">A</ion-select-option>
          <ion-select-option value="b">B</ion-select-option>
        </ion-select>
      `,
        config
      );

      const select = page.locator('ion-select');
      const popover = page.locator('ion-popover');
      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      await select.click();
      await ionPopoverDidPresent.next();

      const popoverOption = popover.locator('.select-interface-option:nth-of-type(2) ion-radio');
      await expect(popoverOption).toBeFocused();
    });
  });
});
