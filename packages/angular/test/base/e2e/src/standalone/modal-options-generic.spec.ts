import { test, expect } from '@playwright/test';

test.describe('Modal Options: Generic Type Parameter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/modal-options-generic');
  });

  test('should open modal created with ModalOptions<typeof Component>', async ({ page }, testInfo) => {
    testInfo.annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/31012',
    });

    await page.locator('ion-button#open-modal').click();

    await expect(page.locator('ion-modal')).toBeVisible();

    const greeting = page.locator('#greeting');
    await expect(greeting).toHaveText('hello world');

    await page.locator('#close-modal').click();
    await expect(page.locator('ion-modal')).not.toBeVisible();
  });
});
