import { test, expect } from '@playwright/test';

/**
 * Verifies that query params on an `<ion-tab-button>` href are preserved when
 * the tab is activated (first visit, switching tabs, switching back, and
 * re-clicking the already-active tab).
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/25470
 */
test.describe('Tabs: query params on tab button href', () => {
  test('should preserve query params on first visit to a tab', async ({ page }) => {
    await page.goto('/standalone/tabs-search-params/tab1?foo=bar');

    await expect(page.locator('app-tabs-search-params-tab1')).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/standalone/tabs-search-params/tab1');
    expect(new URL(page.url()).search).toBe('?foo=bar');
    await expect(page.locator('[data-testid="tab1-foo"]')).toHaveText('bar');
    await expect(page.locator('ion-tab-button[data-testid="tab1"]')).toHaveClass(/tab-selected/);
  });

  test('should preserve href query params when switching to a tab for the first time', async ({ page }) => {
    await page.goto('/standalone/tabs-search-params/tab1?foo=bar');
    await expect(page.locator('app-tabs-search-params-tab1')).toBeVisible();

    await page.locator('ion-tab-button[data-testid="tab2"]').click();
    await expect(page.locator('app-tabs-search-params-tab2')).toBeVisible();

    expect(new URL(page.url()).pathname).toBe('/standalone/tabs-search-params/tab2');
    expect(new URL(page.url()).search).toBe('?baz=qux');
    await expect(page.locator('[data-testid="tab2-baz"]')).toHaveText('qux');
    await expect(page.locator('ion-tab-button[data-testid="tab2"]')).toHaveClass(/tab-selected/);
  });

  test('should preserve query params when switching back to a previously visited tab', async ({ page }) => {
    await page.goto('/standalone/tabs-search-params/tab1?foo=bar');
    await expect(page.locator('app-tabs-search-params-tab1')).toBeVisible();

    await page.locator('ion-tab-button[data-testid="tab2"]').click();
    await expect(page.locator('app-tabs-search-params-tab2')).toBeVisible();

    await page.locator('ion-tab-button[data-testid="tab1"]').click();
    await expect(page.locator('app-tabs-search-params-tab1')).toBeVisible();

    expect(new URL(page.url()).pathname).toBe('/standalone/tabs-search-params/tab1');
    expect(new URL(page.url()).search).toBe('?foo=bar');
    await expect(page.locator('[data-testid="tab1-foo"]')).toHaveText('bar');
  });

  test('should preserve query params when re-clicking the already-active tab', async ({ page }) => {
    await page.goto('/standalone/tabs-search-params/tab1?foo=bar');
    await expect(page.locator('app-tabs-search-params-tab1')).toBeVisible();

    await page.locator('ion-tab-button[data-testid="tab1"]').click();

    expect(new URL(page.url()).pathname).toBe('/standalone/tabs-search-params/tab1');
    expect(new URL(page.url()).search).toBe('?foo=bar');
    await expect(page.locator('[data-testid="tab1-foo"]')).toHaveText('bar');
  });
});
