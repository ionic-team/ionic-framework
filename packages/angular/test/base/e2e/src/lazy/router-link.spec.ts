import { test, expect } from '@playwright/test';
import { testForward, testRoot, testBack, testLifeCycle } from '../../utils/test-helpers';

test.describe('Router Link', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lazy/router-link?ionic:_testing=true');
  });

  test.describe('router-link params and fragments', () => {
    const queryParam = 'A&=#Y';
    const fragment = 'myDiv1';
    const id = 'MyPageID==';

    test('should go to a page with properly encoded values', async ({ page }) => {
      await page.locator('#queryParamsFragment').click();

      const expectedPath = `${encodeURIComponent(id)}`;
      const expectedSearch = `?token=${encodeURIComponent(queryParam)}`;
      const expectedHash = `#${encodeURIComponent(fragment)}`;

      // Check that URL contains all expected parts
      await expect(page).toHaveURL(new RegExp(expectedPath.replace(/=/g, '\\=')));
      await expect(page).toHaveURL(new RegExp(expectedSearch.replace(/\?/g, '\\?')));
      await expect(page).toHaveURL(new RegExp(expectedHash));
    });

    test('should return to a page with preserved query param and fragment', async ({ page }) => {
      await page.locator('#queryParamsFragment').click();
      await page.locator('#goToPage3').click();

      await expect(page).toHaveURL(new RegExp('router-link-page3'));

      await page.locator('#goBackFromPage3').click();

      const expectedPath = `${encodeURIComponent(id)}`;
      const expectedSearch = `?token=${encodeURIComponent(queryParam)}`;
      const expectedHash = `#${encodeURIComponent(fragment)}`;

      await expect(page).toHaveURL(new RegExp(expectedPath.replace(/=/g, '\\=')));
      await expect(page).toHaveURL(new RegExp(expectedSearch.replace(/\?/g, '\\?')));
      await expect(page).toHaveURL(new RegExp(expectedHash));
    });

    test('should preserve query param and fragment with defaultHref string', async ({ page }) => {
      await page.goto('/lazy/router-link-page3?ionic:_testing=true');

      await page.locator('#goBackFromPage3').click();

      const expectedSearch = '?token=ABC';
      const expectedHash = '#fragment';

      await expect(page).toHaveURL(new RegExp(expectedSearch.replace(/\?/g, '\\?')));
      await expect(page).toHaveURL(new RegExp(expectedHash));
    });
  });

  test.describe('router-link', () => {
    test('should have correct lifecycle counts', async ({ page }) => {
      await testLifeCycle(page, 'app-router-link', {
        ionViewWillEnter: 1,
        ionViewDidEnter: 1,
        ionViewWillLeave: 0,
        ionViewDidLeave: 0,
      });
    });
  });

  test.describe('forward', () => {
    test('should go forward with ion-button[routerLink]', async ({ page }) => {
      await page.locator('#routerLink').click();
      await testForward(page);
    });

    test('should go forward with a[routerLink]', async ({ page }) => {
      await page.locator('#a').click();
      await testForward(page);
    });

    test('should go forward with button + navigateByUrl()', async ({ page }) => {
      await page.locator('#button').click();
      await testForward(page);
    });

    test('should go forward with button + navigateForward()', async ({ page }) => {
      await page.locator('#button-forward').click();
      await testForward(page);
    });
  });

  test.describe('root', () => {
    test('should go root with ion-button[routerLink][routerDirection=root]', async ({ page }) => {
      await page.locator('#routerLink-root').click();
      await page.waitForTimeout(100);
      await testRoot(page);
    });

    test('should go root with a[routerLink][routerDirection=root]', async ({ page }) => {
      await page.locator('#a-root').click();
      await page.waitForTimeout(100);
      await testRoot(page);
    });

    test('should go root with button + navigateRoot', async ({ page }) => {
      await page.locator('#button-root').click();
      await page.waitForTimeout(100);
      await testRoot(page);
    });
  });

  test.describe('back', () => {
    test('should go back with ion-button[routerLink][routerDirection=back]', async ({ page }) => {
      await page.locator('#routerLink-back').click();
      await page.waitForTimeout(100);
      await testBack(page);
    });

    test('should go back with a[routerLink][routerDirection=back]', async ({ page }) => {
      await page.locator('#a-back').click();
      await page.waitForTimeout(100);
      await testBack(page);
    });

    test('should go back with button + navigateBack', async ({ page }) => {
      await page.locator('#button-back').click();
      await page.waitForTimeout(100);
      await testBack(page);
    });
  });

  test.describe('tabindex', () => {
    test('should have tabindex="0" with a native span', async ({ page }) => {
      await expect(page.locator('#span')).toHaveAttribute('tabindex', '0');
    });

    test('should not have tabindex set with an ionic button', async ({ page }) => {
      await expect(page.locator('#routerLink')).not.toHaveAttribute('tabindex');
    });
  });
});
