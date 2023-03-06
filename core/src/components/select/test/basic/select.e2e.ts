import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('select: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/select/test/basic');
  });

  test('should not open multiple alert windows when clicked multiple times', async ({ page }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25126',
    });

    const select = page.locator('#gender');

    await select.evaluate((el: HTMLSelectElement) => {
      /*
       * Playwright's click() method attempts to scroll to the handle
       * to perform the action. That is problematic when the overlay
       * is already visible. We manually click() the element instead
       * to avoid flaky tests.
       */
      el.click();
      el.click();
      el.click();
    });

    const alerts = await page.$$('ion-alert');

    expect(alerts.length).toBe(1);
  });

  test.describe('select: alert', () => {
    test('it should open an alert select', async ({ page }) => {
      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
      const ionDismiss = await page.spyOnEvent('ionDismiss');

      await page.click('#customAlertSelect');

      await ionAlertDidPresent.next();

      await expect(page).toHaveScreenshot(`select-alert-diff-${page.getSnapshotSettings()}.png`, {
        animations: 'disabled',
      });

      const alert = await page.locator('ion-alert');
      await alert.evaluate((el: HTMLIonAlertElement) => el.dismiss());

      await ionDismiss.next();
    });
  });

  test.describe('select: action sheet', () => {
    test('it should open an action sheet select', async ({ page }) => {
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const ionDismiss = await page.spyOnEvent('ionDismiss');

      await page.click('#customActionSheetSelect');

      await ionActionSheetDidPresent.next();

      await expect(page).toHaveScreenshot(`select-action-sheet-diff-${page.getSnapshotSettings()}.png`, {
        animations: 'disabled',
      });

      const actionSheet = await page.locator('ion-action-sheet');
      await actionSheet.evaluate((el: HTMLIonActionSheetElement) => el.dismiss());

      await ionDismiss.next();
    });
  });

  test.describe('select: popover', () => {
    test('it should open a popover select', async ({ page, skip }) => {
      // TODO (FW-2979)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');
      const ionDismiss = await page.spyOnEvent('ionDismiss');

      await page.click('#customPopoverSelect');

      await ionPopoverDidPresent.next();

      const popover = page.locator('ion-popover');

      // select has no value, so first option should be focused by default
      const popoverOption1 = popover.locator('.select-interface-option:first-of-type ion-radio');
      await expect(popoverOption1).toBeFocused();

      await expect(page).toHaveScreenshot(`select-popover-diff-${page.getSnapshotSettings()}.png`, {
        animations: 'disabled',
      });

      await popover.evaluate((el: HTMLIonPopoverElement) => el.dismiss());

      await ionDismiss.next();
    });
  });
});
