import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('router: redirect', () => {
    test(title('contains query parameters after redirect'), async ({ page }) => {
      await page.goto(`/src/components/router/test/basic#/redirect-to-three`, config);

      expect(page.url()).toContain('#/three?has_query_string=true');
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('router: push', () => {
    test(title('should support relative path'), async ({ page }) => {
      await page.goto(`/src/components/router/test/basic#/two/three/hola`, config);
      await page.click('#btn-rel');

      expect(page.url()).toContain('#/two/three/relative?param=1');
    });

    test(title('should support absolute path'), async ({ page }) => {
      await page.goto(`/src/components/router/test/basic#/two/three/hola`, config);
      await page.click('#btn-abs');

      expect(page.url()).toContain('#/two/three/absolute');
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('router: tabs', () => {
    test(title('should activate the initial tab'), async ({ page }) => {
      await page.goto(`/src/components/router/test/basic`, config);

      const tabOne = page.locator('tab-one');

      await expect(tabOne).toBeVisible();

      expect(page.url()).toContain('/basic?');
    });

    /**
     * Selects the Schedule (tab two) tab and verifies that both the
     * page is visible and the URL is correct.
     */
    test(title('selecting a tab routes to the tab page'), async ({ page }) => {
      await page.goto(`/src/components/router/test/basic`, config);

      const tabOne = page.locator('tab-one');
      const tabTwo = page.locator('tab-two');

      await page.click('#tab-button-tab-two');

      await expect(tabOne).toBeHidden();
      await expect(tabTwo).toBeVisible();

      expect(page.url()).toContain('#/two');
    });

    test(title('should navigate to a nested page within a tab'), async ({ page }) => {
      await page.goto('/src/components/router/test/basic#/two', config);

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

    test(title('navigating directly to a sub page should activate the page'), async ({ page }) => {
      await page.goto('/src/components/router/test/basic#/two/second-page', config);

      const tabTwo = page.locator('tab-two');
      const pageTwo = page.locator('page-two');

      await expect(tabTwo).toBeVisible();
      await expect(pageTwo).toBeVisible();
    });
  });
});
