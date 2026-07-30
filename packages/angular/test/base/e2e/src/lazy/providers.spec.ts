import { test, expect } from '@playwright/test';

test.describe('Providers', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/providers');
  });

  test('should load all providers', async ({ page }) => {
    await expect(page.locator('#is-loaded')).toHaveText('true');
    await expect(page.locator('#is-ready')).toHaveText('true');
    await expect(page.locator('#is-paused')).toHaveText('true');
    await expect(page.locator('#is-resumed')).toHaveText('true');
    await expect(page.locator('#is-resized')).toHaveText('true');
    await expect(page.locator('#is-testing')).toHaveText('false');
    await expect(page.locator('#is-desktop')).toHaveText('true');
    await expect(page.locator('#is-mobile')).toHaveText('false');
    await expect(page.locator('#keyboard-height')).toHaveText('12345');
    await expect(page.locator('#query-params')).toHaveText('firstParam: null, secondParam: null');
  });

  // Guards the zoneless re-render path for Platform observables: a resize fired
  // after the initial render must still update the view. The constructor's
  // synthetic resize only proves wiring during the first CD pass. This fires a
  // resize from outside Angular post-render, which only re-renders if the resize
  // subscription's markForCheck reaches the scheduler.
  test('should re-render when a resize is fired after load', async ({ page }) => {
    await expect(page.locator('#resize-count')).toHaveText('1');

    await page.evaluate(() => window.dispatchEvent(new CustomEvent('resize')));

    await expect(page.locator('#resize-count')).toHaveText('2');
  });

  test('should detect testing mode', async ({ page }) => {
    await page.goto('/lazy/providers?ionic:_testing=true');

    await expect(page.locator('#is-testing')).toHaveText('true');
  });

  test('should get query params', async ({ page }) => {
    await page.goto('/lazy/providers?firstParam=abc&secondParam=true');

    await expect(page.locator('#query-params')).toHaveText('firstParam: abc, secondParam: true');
  });

  // https://github.com/ionic-team/ionic-framework/issues/28337
  test('should register menus correctly', async ({ page }) => {
    await page.locator('#set-menu-count').click();
    await expect(page.locator('#registered-menu-count')).toHaveText('1');
  });

  test('should open an action sheet', async ({ page }) => {
    await page.locator('button#open-action-sheet').click();

    await expect(page.locator('ion-action-sheet')).toBeVisible();
  });

  test('should open an alert', async ({ page }) => {
    await page.locator('button#open-alert').click();

    await expect(page.locator('ion-alert')).toBeVisible();
  });

  test('should open a loading-indicator', async ({ page }) => {
    await page.locator('button#open-loading').click();

    await expect(page.locator('ion-loading')).toBeVisible();
  });
});
