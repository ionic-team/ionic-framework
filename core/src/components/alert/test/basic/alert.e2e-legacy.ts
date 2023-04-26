import { expect } from '@playwright/test';
import type { E2EPage } from '@utils/test/playwright';
import { test } from '@utils/test/playwright';

const openAlert = async (page: E2EPage, buttonID: string) => {
  const didPresent = await page.spyOnEvent('ionAlertDidPresent');

  await page.click(`#${buttonID}`);
  await didPresent.next();

  return page.locator('ion-alert');
};

const testAlert = async (page: E2EPage, buttonID: string) => {
  await page.goto(`/src/components/alert/test/basic`);

  const didDismiss = await page.spyOnEvent('ionAlertDidDismiss');
  const alert = await openAlert(page, buttonID);

  await expect(alert).toBeVisible();
  await expect(alert).toHaveScreenshot(`alert-${buttonID}-${page.getSnapshotSettings()}.png`);

  await alert.evaluate((el: HTMLIonAlertElement) => el.dismiss());
  await didDismiss.next();

  await expect(alert).toHaveCount(0);
};

test.describe('alert: basic', () => {
  test('focus trap should work correctly', async ({ page, skip, browserName }) => {
    skip.rtl();
    await page.goto(`/src/components/alert/test/basic`);

    const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';

    const alert = await openAlert(page, 'multipleButtons');
    const alertBtns = alert.locator('button');

    await page.keyboard.press(tabKey);
    await expect(alertBtns.nth(0)).toBeFocused();

    await page.keyboard.press(`Shift+${tabKey}`);
    await expect(alertBtns.nth(2)).toBeFocused();

    await page.keyboard.press(tabKey);
    await expect(alertBtns.nth(0)).toBeFocused();
  });

  test('should set custom attributes', async ({ page, skip }) => {
    skip.rtl();
    await page.goto(`/src/components/alert/test/basic`);

    const alert = await openAlert(page, 'basic');
    await expect(alert).toHaveAttribute('data-testid', 'basic-alert');
  });

  test('should dismiss when async handler resolves', async ({ page, skip }) => {
    skip.rtl();
    await page.goto(`/src/components/alert/test/basic`);

    const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');
    const ionAlertDidDismiss = await page.spyOnEvent('ionAlertDidDismiss');
    const ionLoadingDidDismiss = await page.spyOnEvent('ionLoadingDidDismiss');

    const alert = page.locator('ion-alert');

    await page.click('#asyncHandler');
    await ionAlertDidPresent.next();

    await page.click('.alert-button');

    await expect(alert).toBeVisible();

    await ionLoadingDidDismiss.next();
    await ionAlertDidDismiss.next();

    await expect(alert).toBeHidden();
  });

  test.describe('should not have visual regressions', () => {
    test('header, subheader, message', async ({ page }) => {
      await testAlert(page, 'basic');
    });

    test('long message', async ({ page }) => {
      await testAlert(page, 'longMessage');
    });

    test('more than two buttons', async ({ page }) => {
      await testAlert(page, 'multipleButtons');
    });

    test('no message', async ({ page }) => {
      await testAlert(page, 'noMessage');
    });

    test('two buttons', async ({ page }) => {
      await testAlert(page, 'confirm');
    });

    test('form prompt', async ({ page }) => {
      await testAlert(page, 'prompt');
    });

    test('radios', async ({ page }) => {
      await testAlert(page, 'radio');
    });

    test('checkboxes', async ({ page }) => {
      await testAlert(page, 'checkbox');
    });
  });
});
