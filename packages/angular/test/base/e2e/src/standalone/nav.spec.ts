import { test, expect } from '@playwright/test';

test.describe('Nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/nav');
  });

  test('should mount the root component', async ({ page }) => {
    await expect(page.locator('app-nav')).toBeVisible();

    await expect(page.locator('ion-title')).toHaveText('Page One');
  });

  test('should navigate to page two', async ({ page }) => {
    await page.locator('ion-content ion-button').click();
    await expect(page.locator('ion-title').filter({ hasText: 'Page Two' })).toBeVisible();
  });

  test('should navigate to page three', async ({ page }) => {
    await page.getByText('Go to Page Two').click();
    await expect(page.locator('ion-title').filter({ hasText: 'Page Two' })).toBeVisible();

    await page.getByText('Go to Page Three').click();
    await expect(page.locator('ion-title').filter({ hasText: 'Page Three' })).toBeVisible();
  });

  test('should navigate back to page one', async ({ page }) => {
    await page.getByText('Go to Page Two').click();
    await expect(page.locator('ion-title').filter({ hasText: 'Page Two' })).toBeVisible();

    // TODO: This should be a back button but it is not working
    await page.locator('ion-toolbar ion-button').click();
    await expect(page.locator('ion-title').filter({ hasText: 'Page One' })).toBeVisible();
  });
});
