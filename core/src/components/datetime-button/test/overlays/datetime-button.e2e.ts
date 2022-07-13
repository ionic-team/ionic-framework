import { expect } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { test } from '@utils/test/playwright';
import type { EventSpy } from '@utils/test/playwright';

test.describe('datetime-button: popover', () => {
  let datetime: Locator;
  let popover: Locator;
  let ionPopoverDidPresent: EventSpy;
  let ionPopoverDidDismiss: EventSpy;
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === 'rtl', 'No layout tests');
    test.skip(testInfo.project.metadata.mode === 'ios', 'No mode-specific logic');

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
    await page.locator('.date-target-container').click();

    await ionPopoverDidPresent.next();

    expect(datetime).toBeVisible();
  });
  test('should open the time popover', async ({ page }) => {
    await page.locator('.time-target-container').click();

    await ionPopoverDidPresent.next();

    expect(datetime).toBeVisible();
  });
  test('should open the date popover then the time popover', async ({ page }) => {
    await page.locator('.date-target-container').click();
    await ionPopoverDidPresent.next();
    expect(datetime).toBeVisible();

    await popover.evaluate((el: HTMLIonPopoverElement) => el.dismiss());
    await ionPopoverDidDismiss.next();

    await page.locator('.time-target-container').click();
    await ionPopoverDidPresent.next();
    expect(datetime).toBeVisible();
  });
  test('should open the time popover then the date popover', async ({ page }) => {
    await page.locator('.time-target-container').click();
    await ionPopoverDidPresent.next();
    expect(datetime).toBeVisible();

    await popover.evaluate((el: HTMLIonPopoverElement) => el.dismiss());
    await ionPopoverDidDismiss.next();

    await page.locator('.date-target-container').click();
    await ionPopoverDidPresent.next();
    expect(datetime).toBeVisible();
  });
});

test.describe('datetime-button: modal', () => {
  let datetime: Locator;
  let modal: Locator;
  let ionModalDidPresent: EventSpy;
  let ionModalDidDismiss: EventSpy;
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === 'rtl', 'No layout tests');
    test.skip(testInfo.project.metadata.mode === 'ios', 'No mode-specific logic');

    await page.setContent(`
      // TODO Remove when FW-318 is fixed
      <style>
      .ion-page {
        position: relative;
        contain: layout style;
        width: 100%;
        height: 100%;
      }
      </style>
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
    await page.locator('.date-target-container').click();

    await ionModalDidPresent.next();

    expect(datetime).toBeVisible();
  });
  test('should open the time modal', async ({ page }) => {
    await page.locator('.time-target-container').click();

    await ionModalDidPresent.next();

    expect(datetime).toBeVisible();
  });
  test('should open the date modal then the time modal', async ({ page }) => {
    await page.locator('.date-target-container').click();
    await ionModalDidPresent.next();
    expect(datetime).toBeVisible();

    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
    await ionModalDidDismiss.next();

    await page.locator('.time-target-container').click();
    await ionModalDidPresent.next();
    expect(datetime).toBeVisible();
  });
  test('should open the time modal then the date modal', async ({ page }) => {
    await page.locator('.time-target-container').click();
    await ionModalDidPresent.next();
    expect(datetime).toBeVisible();

    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
    await ionModalDidDismiss.next();

    await page.locator('.date-target-container').click();
    await ionModalDidPresent.next();
    expect(datetime).toBeVisible();
  });
});
