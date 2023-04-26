import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('modal: inline', () => {
  test('it should present and then remain in the dom on dismiss', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');
    await page.goto('/src/components/modal/test/inline');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
    const modal = page.locator('ion-modal');

    await page.click('#open-inline-modal');

    await ionModalDidPresent.next();

    await expect(modal).toBeVisible();

    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());

    await ionModalDidDismiss.next();

    await expect(modal).toBeHidden();
  });

  test('presenting should create a single root element with the ion-page class', async ({ page, skip }, testInfo) => {
    skip.mode('md');
    skip.rtl();

    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/26117',
    });

    await page.setContent(`
    <ion-datetime-button datetime="datetime"></ion-datetime-button>

    <ion-modal>
      <ion-datetime id="datetime" presentation="date-time"></ion-datetime>
    </ion-modal>
    `);

    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');
    const ionModalDidDismiss = await page.spyOnEvent('ionModalDidDismiss');
    const modal = page.locator('ion-modal');

    await page.click('#date-button');
    await ionModalDidPresent.next();

    // Verifies that the host element exists with the .ion-page class
    expect(await modal.evaluate((el: HTMLIonModalElement) => el.firstElementChild!.className)).toContain('ion-page');

    await modal.evaluate((el: HTMLIonModalElement) => el.dismiss());
    await ionModalDidDismiss.next();

    await page.click('#date-button');
    await ionModalDidPresent.next();

    // Verifies that presenting the overlay again does not create a new host element
    expect(await modal.evaluate((el: HTMLIonModalElement) => el.firstElementChild!.className)).toContain('ion-page');
    expect(
      await modal.evaluate((el: HTMLIonModalElement) => el.firstElementChild!.firstElementChild!.className)
    ).not.toContain('ion-page');
  });
});
