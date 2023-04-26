import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('router: redirect', () => {
  test.beforeEach(({ skip }) => {
    skip.mode('md');
    skip.rtl();
  });

  test('contains query parameters after redirect', async ({ page }) => {
    await page.goto(`/src/components/router/test/basic#/redirect-to-three`);

    expect(page.url()).toContain('#/three?has_query_string=true');
  });
});

test.describe('router: push', () => {
  test.beforeEach(({ skip }) => {
    skip.mode('md');
    skip.rtl();
  });

  test('should support relative path', async ({ page }) => {
    await page.goto(`/src/components/router/test/basic#/two/three/hola`);
    await page.click('#btn-rel');

    expect(page.url()).toContain('#/two/three/relative?param=1');
  });

  test('should support absolute path', async ({ page }) => {
    await page.goto(`/src/components/router/test/basic#/two/three/hola`);
    await page.click('#btn-abs');

    expect(page.url()).toContain('#/two/three/absolute');
  });
});

test.describe('router: tabs', () => {
  test.beforeEach(({ skip }) => {
    skip.mode('md');
    skip.rtl();
  });

  test('should activate the initial tab', async ({ page }) => {
    await page.goto(`/src/components/router/test/basic`);

    const tabOne = page.locator('tab-one');

    await expect(tabOne).toBeVisible();

    expect(page.url()).toContain('/basic?');
  });

  /**
   * Selects the Schedule (tab two) tab and verifies that both the
   * page is visible and the URL is correct.
   */
  test('selecting a tab routes to the tab page', async ({ page }) => {
    await page.goto(`/src/components/router/test/basic`);

    const tabOne = page.locator('tab-one');
    const tabTwo = page.locator('tab-two');

    await page.click('#tab-button-tab-two');

    await expect(tabOne).toBeHidden();
    await expect(tabTwo).toBeVisible();

    expect(page.url()).toContain('#/two');
  });

  test('should navigate to a nested page within a tab', async ({ page }) => {
    await page.goto('/src/components/router/test/basic#/two');

    const tabTwo = page.locator('tab-two');
    const pageOne = page.locator('page-one');

    await expect(tabTwo).toBeVisible();
    await expect(pageOne).toBeVisible();

    await page.click('text=Go to page 2');

    const pageTwo = page.locator('page-two');

    await expect(pageTwo).toBeVisible();
    await expect(pageOne).toBeHidden();

    await expect(page.url()).toContain('#/two/second-page');
  });

  test('navigating directly to a sub page should activate the page', async ({ page }) => {
    await page.goto('/src/components/router/test/basic#/two/second-page');

    const tabTwo = page.locator('tab-two');
    const pageTwo = page.locator('page-two');

    await expect(tabTwo).toBeVisible();
    await expect(pageTwo).toBeVisible();
  });
});
