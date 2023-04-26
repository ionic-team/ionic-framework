import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('modal: trigger', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');
    await page.goto('/src/components/modal/test/trigger');
  });

  test('should open modal by left clicking on trigger', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#left-click-trigger');

    await ionModalDidPresent.next();

    const modal = page.locator('.left-click-modal');
    await expect(modal).toBeVisible();
  });

  test('should still open modal when it has been removed and re-added to DOM', async ({ page }) => {
    const button = page.locator('#left-click-trigger');
    const modal = page.locator('ion-modal');

    await modal.evaluate((modal: HTMLIonModalElement) => {
      modal.remove();
      document.querySelector('ion-button')?.insertAdjacentElement('afterend', modal);
    });
    await page.waitForChanges();

    await button.click();
    await expect(modal).toBeVisible();
  });
});
