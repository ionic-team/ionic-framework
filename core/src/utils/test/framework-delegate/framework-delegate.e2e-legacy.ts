import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('framework-delegate', () => {
  test.beforeEach(async ({ page, skip }) => {
    skip.rtl();
    skip.mode('ios');

    await page.goto('/src/utils/test/framework-delegate');
  });
  test('should present modal already at ion-app root', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#button-inline-root');

    const modal = page.locator('#inline-root');
    await ionModalDidPresent.next();
    await expect(modal).toBeVisible();
  });

  test('should present modal in content', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#button-inline-content');

    const modal = page.locator('#inline-content');
    await ionModalDidPresent.next();
    await expect(modal).toBeVisible();
  });

  test('should present modal via controller', async ({ page }) => {
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#button-controller');

    const modal = page.locator('#controller');
    await ionModalDidPresent.next();
    await expect(modal).toBeVisible();
  });
});
