import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('action sheet: isOpen', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl('isOpen does not behave differently in RTL');
    skip.mode('md', 'isOpen does not behave differently in MD');
    await page.goto('/src/components/action-sheet/test/is-open');
  });

  test('should open the action sheet', async ({ page }) => {
    const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
    const actionSheet = page.locator('ion-action-sheet');

    await page.click('#default');

    await ionActionSheetDidPresent.next();
    await expect(actionSheet).toBeVisible();
  });

  test('should open the action sheet then close after a timeout', async ({ page }) => {
    const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
    const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');
    const actionSheet = page.locator('ion-action-sheet');

    await page.click('#timeout');

    await ionActionSheetDidPresent.next();
    await expect(actionSheet).toBeVisible();

    await ionActionSheetDidDismiss.next();

    await expect(actionSheet).toBeHidden();
  });
});
