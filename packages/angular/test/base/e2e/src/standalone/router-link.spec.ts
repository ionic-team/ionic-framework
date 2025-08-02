import { test, expect } from '@playwright/test';

test.describe('RouterLink', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/router-link');
  });

  test('should mount the root component', async ({ page }) => {
    await expect(page.locator('app-router-link')).toBeVisible();

    await expect(page.locator('text=I\'m a link')).toBeVisible();
  });

  test('should go to /standalone/popover using an anchor', async ({ page }) => {
    // click on the anchor
    await page.locator('a').filter({ hasText: 'I\'m a link' }).click();

    await expect(page).toHaveURL(/.*\/standalone\/popover/);
  });

  test('should go to /standalone/popover using a button', async ({ page }) => {
    await page.locator('button').filter({ hasText: 'I\'m a button' }).click();

    await expect(page).toHaveURL(/.*\/standalone\/popover/);
  });

  // Angular sets the `tabindex` to `"0"` on any element that uses
  // the `routerLink` directive. Ionic removes the `tabindex` from
  // components that wrap an `a` or `button` element, so we are
  // checking here that it is only removed from Ionic components.
  // https://github.com/ionic-team/ionic-framework/issues/20632
  test('should have tabindex="0" with a native span', async ({ page }) => {
    await expect(page.locator('span[routerlink="/standalone/popover"]')).toHaveAttribute('tabindex', '0');
  });

  test('should not have tabindex set with an ionic button', async ({ page }) => {
    await expect(page.locator('ion-button')).not.toHaveAttribute('tabindex');
  });
});
