import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { test } from '@utils/test/playwright';
import type { EventSpy } from '@utils/test/playwright';

test.describe('datetime-button: rendering', () => {
  test('should size the modal correctly', async ({ page }) => {
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-modal>
        <ion-datetime id="datetime" show-default-title="true" show-default-buttons="true" value="2022-01-01T16:30:00"></ion-datetime>
      </ion-modal>
    `);

    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const dateButton = page.locator('ion-datetime-button #date-button');
    await dateButton.click();
    await ionModalDidPresent.next();

    await expect(await page.screenshot({ animations: 'disabled' })).toHaveScreenshot(
      `datetime-overlay-modal-${page.getSnapshotSettings()}.png`
    );
  });

  test('should size the popover correctly', async ({ page, skip }) => {
    skip.browser('firefox', 'Rendering is flaky in Firefox 107');
    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>
      <ion-popover>
        <ion-datetime id="datetime" show-default-title="true" show-default-buttons="true" value="2022-01-01T16:30:00"></ion-datetime>
      </ion-popover>
    `);

    const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    const dateButton = page.locator('ion-datetime-button #date-button');
    await dateButton.click();
    await ionPopoverDidPresent.next();

    await expect(await page.screenshot({ animations: 'disabled' })).toHaveScreenshot(
      `datetime-overlay-popover-${page.getSnapshotSettings()}.png`
    );
  });
});

test.describe('datetime-button: popover', () => {
  let datetime: Locator;
  let popover: Locator;
  let ionPopoverDidPresent: EventSpy;
  let ionPopoverDidDismiss: EventSpy;
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios', 'No mode-specific logic');

    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>

      <ion-popover>
        <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
      </ion-popover>
    `);

    datetime = page.locator('ion-datetime');
    popover = page.locator('ion-popover');
    ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
    ionPopoverDidDismiss = await page.spyOnEvent('ionPopoverDidDismiss');
  });
  test('should open the date popover', async ({ page }) => {
    await page.locator('#date-button').click();

    await ionPopoverDidPresent.next();

    await expect(datetime).toBeVisible();
  });
  test('should open the time popover', async ({ page }) => {
    await page.locator('#time-button').click();

    await ionPopoverDidPresent.next();

    await expect(datetime).toBeVisible();
  });
  test('should open the date popover then the time popover', async ({ page }) => {
    await page.locator('#date-button').click();
    await ionPopoverDidPresent.next();
    await expect(datetime).toBeVisible();

    await popover.evaluate((el: HTMLIonPopoverElement) => el.dismiss());
    await ionPopoverDidDismiss.next();

    await page.locator('#time-button').click();
    await ionPopoverDidPresent.next();
    await expect(datetime).toBeVisible();
  });
  test('should open the time popover then the date popover', async ({ page }) => {
    await page.locator('#time-button').click();
    await ionPopoverDidPresent.next();
    await expect(datetime).toBeVisible();

    await popover.evaluate((el: HTMLIonPopoverElement) => el.dismiss());
    await ionPopoverDidDismiss.next();

    await page.locator('#date-button').click();
    await ionPopoverDidPresent.next();
    await expect(datetime).toBeVisible();
  });
});

test.describe('datetime-button: modal', () => {
  let datetime: Locator;
  let modal: Locator;
  let ionModalDidPresent: EventSpy;
  let ionModalDidDismiss: EventSpy;
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios', 'No mode-specific logic');

    await page.setContent(`
      <ion-datetime-button datetime="datetime"></ion-datetime-button>

      <ion-modal>
        <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
      </ion-modal>
    `);

    datetime = page.locator('ion-datetime');
    modal = page.locator('ion-modal');
    ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
  });
  test('should open the date modal', async ({ page }) => {
    await page.locator('#date-button').click();

    await ionModalDidPresent.next();

    await expect(datetime).toBeVisible();
  });
  test('should open the time modal', async ({ page }) => {
    await page.locator('#time-button').click();

    await ionModalDidPresent.next();

    await expect(datetime).toBeVisible();
  });
  test('should open the date modal then the time modal', async ({ page }) => {
    await page.locator('#date-button').click();
    await ionModalDidPresent.next();
    await expect(datetime).toBeVisible();

    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
    await ionModalDidDismiss.next();

    await page.locator('#time-button').click();
    await ionModalDidPresent.next();
    await expect(datetime).toBeVisible();
  });
  test('should open the time modal then the date modal', async ({ page }) => {
    await page.locator('#time-button').click();
    await ionModalDidPresent.next();
    await expect(datetime).toBeVisible();

    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
    await ionModalDidDismiss.next();

    await page.locator('#date-button').click();
    await ionModalDidPresent.next();
    await expect(datetime).toBeVisible();
  });
});
