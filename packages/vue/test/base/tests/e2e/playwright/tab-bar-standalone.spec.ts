import { test, expect } from './utils/test-base';
import { ionPageVisible, tabClick } from './utils/test-utils';

/**
 * https://github.com/ionic-team/ionic-framework/issues/30361
 * ion-tab-bar used without ion-tabs or ion-router-outlet, with the app
 * navigating by method from the tab buttons.
 */
test.describe('Tab Bar: standalone', () => {
  test('should switch tabs on click without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        errors.push(msg.text());
      }
    });

    await page.goto('/tabs-standalone');
    await ionPageVisible(page, 'tabs-standalone');

    const tab1 = page.locator('ion-tab-button#tab-button-tab1');
    const tab2 = page.locator('ion-tab-button#tab-button-tab2');

    await expect(tab1).toHaveClass(/tab-selected/);
    await expect(page.locator('#active-tab')).toHaveText('tab1');

    await tabClick(page, 'tab2');

    await expect(tab2).toHaveClass(/tab-selected/);
    await expect(tab1).not.toHaveClass(/tab-selected/);
    await expect(page.locator('#active-tab')).toHaveText('tab2');
    // With no router outlet, a tab button must not change the URL itself.
    await expect(page).toHaveURL(/\/tabs-standalone(\?|$)/);

    await tabClick(page, 'tab1');

    await expect(tab1).toHaveClass(/tab-selected/);
    await expect(tab2).not.toHaveClass(/tab-selected/);
    await expect(page.locator('#active-tab')).toHaveText('tab1');

    expect(errors).toEqual([]);
  });

  test('should navigate by method from a tab button', async ({ page }) => {
    await page.goto('/tabs-standalone');
    await ionPageVisible(page, 'tabs-standalone');

    await tabClick(page, 'routing');

    await ionPageVisible(page, 'routing');
    await expect(page).toHaveURL(/\/routing(\?|$)/);
  });
});
