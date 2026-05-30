import { test, expect } from '@playwright/test';

test.describe('Tabs', () => {
  test.describe('Without IonRouterOutlet', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/tabs');
    });

    test('should redirect to the default tab', async ({ page }) => {
      await expect(page.locator('app-tab-one')).toBeVisible();
      await expect(page.locator('text=Tab 1')).toBeVisible();
    });

    test('should render new content when switching tabs', async ({ page }) => {
      await page.locator('#tab-button-tab-two').click();
      await expect(page.locator('app-tab-two')).toBeVisible();
      await expect(page.locator('text=Tab 2')).toBeVisible();
    });

    // Issue: https://github.com/ionic-team/ionic-framework/issues/28417
    test('parentOutlet should be defined', async ({ page }) => {
      await expect(page.locator('#parent-outlet span')).toHaveText('true');
    });
  });

  test.describe('Without IonRouterOutlet', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/standalone/tabs-basic');
    });

    test('should show correct tab when clicking the tab button', async ({ page }) => {
      await expect(page.locator('ion-tab[tab="tab1"]')).toBeVisible();
      await expect(page.locator('ion-tab[tab="tab2"]')).not.toBeVisible();

      await page.locator('ion-tab-button[tab="tab2"]').click();

      await expect(page.locator('ion-tab[tab="tab1"]')).not.toBeVisible();
      await expect(page.locator('ion-tab[tab="tab2"]')).toBeVisible();
    });

    test('should not change the URL when clicking the tab button', async ({ page }) => {
      await expect(page).toHaveURL(/.*\/tabs-basic/);

      await page.locator('ion-tab-button[tab="tab2"]').click();

      await expect(page).toHaveURL(/.*\/tabs-basic/);
    });
  });
});
