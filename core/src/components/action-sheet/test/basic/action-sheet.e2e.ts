import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('action sheet: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/action-sheet/test/basic`);
  });
  test.describe('action sheet: data', () => {
    test('should return data', async ({ page }) => {
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');

      const button = page.locator('#buttonData');
      await button.click();

      await ionActionSheetDidPresent.next();

      const buttonOption = page.locator('ion-action-sheet button#option');
      await buttonOption.click();

      await ionActionSheetDidDismiss.next();
      expect(ionActionSheetDidDismiss).toHaveReceivedEventDetail({ data: { type: '1' } });
    });
    test('should return cancel button data', async ({ page }) => {
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');
      const ionActionSheetDidDismiss = await page.spyOnEvent('ionActionSheetDidDismiss');

      const button = page.locator('#buttonData');
      await button.click();

      await ionActionSheetDidPresent.next();

      const buttonOption = page.locator('ion-action-sheet button.action-sheet-cancel');
      await buttonOption.click();

      await ionActionSheetDidDismiss.next();
      expect(ionActionSheetDidDismiss).toHaveReceivedEventDetail({ data: { type: 'cancel' }, role: 'cancel' });
    });
  })
  test.describe('action sheet: attributes', () => {
    test('should set htmlAttributes', async ({ page }) => {
      const ionActionSheetDidPresent = await page.spyOnEvent('ionActionSheetDidPresent');

      const button = page.locator('#basic');
      await button.click();

      await ionActionSheetDidPresent.next();

      const actionSheet = page.locator('ion-action-sheet');
      expect(actionSheet).toHaveAttribute('data-testid', 'basic-action-sheet');
    });
  })
});
