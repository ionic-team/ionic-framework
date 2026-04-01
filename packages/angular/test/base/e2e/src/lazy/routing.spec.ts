import { test, expect } from '@playwright/test';
import { ionSwipeToGoBack } from '../../utils/drag-utils';
import { ionPageVisible, ionPageHidden, ionPageDoesNotExist, testStack } from '../../utils/test-utils';

test.describe('Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/router-link?ionic:mode=ios');
  });

  test('should swipe and abort', async ({ page }) => {
    await page.locator('#routerLink').click();

    await ionSwipeToGoBack(page);

    await expect(page.locator('app-router-link')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('app-router-link')).toHaveAttribute('class', 'ion-page ion-page-hidden');

    await expect(page.locator('app-router-link-page')).not.toHaveAttribute('aria-hidden');
    await expect(page.locator('app-router-link-page')).toHaveAttribute('class', 'ion-page can-go-back');
  });

  test('should swipe and go back', async ({ page }) => {
    await page.locator('#routerLink').click();

    await ionPageHidden(page, 'app-router-link');
    await ionPageVisible(page, 'app-router-link-page');

    await testStack(page, 'ion-router-outlet', ['app-router-link', 'app-router-link-page']);

    await ionSwipeToGoBack(page, true);

    await ionPageVisible(page, 'app-router-link');
    await ionPageDoesNotExist(page, 'app-router-link-page');

    await testStack(page, 'ion-router-outlet', ['app-router-link']);

    await expect(page.locator('app-router-link')).not.toHaveAttribute('aria-hidden');
    await expect(page.locator('app-router-link')).toHaveAttribute('class', 'ion-page');
  });
});
