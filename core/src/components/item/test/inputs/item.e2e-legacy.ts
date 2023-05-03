import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import type { EventSpy } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

test.describe('item: inputs', () => {
  let ionPopoverDidPresent: EventSpy;
  let ionPopoverDidDismiss: EventSpy;
  let formData: EventSpy;

  let popover: Locator;

  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/item/test/inputs`);

    ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
    formData = await page.spyOnEvent('formData');

    popover = page.locator('ion-popover#optionsPopover');
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();
    await expect(page).toHaveScreenshot(`item-inputs-${page.getSnapshotSettings()}.png`);
  });

  test('disabled controls should not have visual regressions', async ({ page }) => {
    await page.click('#popover-trigger');
    await ionPopoverDidPresent.next();

    await page.click('#btnDisabled');

    await page.waitForChanges();

    await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
    await ionPopoverDidDismiss.next();

    await page.setIonViewport();
    await expect(page).toHaveScreenshot(`item-inputs-disabled-${page.getSnapshotSettings()}.png`);
  });

  test.describe('form data', () => {
    test.beforeEach(async ({ skip }) => {
      skip.rtl();
    });

    test('initial form data should be empty', async ({ page }) => {
      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: '',
        textarea: '',
        toggle: '',
        checkbox: '',
        select: '',
        datetime: '2022-04-01T10:00',
        range: '10',
      });
    });

    test('form controls have some value', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnSomeValue');
      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: 'Some value',
        textarea: 'Some value',
        toggle: 'on',
        checkbox: 'on',
        select: '2',
        datetime: '2022-04-01T10:00',
        range: '20',
      });
    });

    test('form control values set to be empty', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnEmptyValue');
      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: '',
        textarea: '',
        toggle: '',
        checkbox: '',
        select: '',
        datetime: '',
        range: '0',
      });
    });

    test('form control values set to null', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnNullValue');
      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: '',
        textarea: '',
        toggle: '',
        checkbox: '',
        select: '',
        datetime: '',
        range: '0',
      });
    });

    test('form control values set to undefined', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnUndefinedValue');
      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({
        input: '',
        textarea: '',
        toggle: '',
        checkbox: '',
        select: '',
        datetime: '',
        range: '0',
      });
    });

    test('should not have form data when controls are disabled', async ({ page }) => {
      await page.click('#popover-trigger');
      await ionPopoverDidPresent.next();

      await page.click('#btnSomeValue');
      await page.click('#btnDisabled');

      await page.waitForChanges();

      await popover.evaluateHandle((el: HTMLIonPopoverElement) => el.dismiss());
      await ionPopoverDidDismiss.next();

      await page.click('#submit');

      await formData.next();

      expect(formData).toHaveReceivedEventDetail({});
    });
  });
});
