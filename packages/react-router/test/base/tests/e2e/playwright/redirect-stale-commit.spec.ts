import { test, expect } from '@playwright/test';
import { ionPageVisible } from './utils/test-utils';

/**
 * Regression tests for ionic-team/ionic-framework#31709: when the app
 * pushes a route in an `IonTabs` outlet and that route immediately
 * redirects, the tabs outlet can end up with two pages that are not
 * hidden.
 *
 * - Path A: the redirect lands while the forward transition to the
 *   redirecting route is still running. The empty Banana outlet is left
 *   visible on top of Apple. The test triggers the redirect manually once
 *   both the Orange (leaving) and Banana (entering) outlets are visible,
 *   i.e. while the forward transition is in flight. (A fixed millisecond
 *   delay proved too timing-sensitive in this environment: 10 ms never
 *   reproduced it here. `ion-page-invisible` is not a usable signal
 *   either: a freshly mounted outlet is already visible when the commit
 *   runs, so the class is never added.)
 * - Path B: the redirect lands before the redirecting route's page
 *   registers (0 ms timer). The Orange outlet the user pushed from is
 *   never hidden.
 *
 * After the redirect, only the Apple outlet should be visible in the tabs
 * outlet. (In the unfixed build the 0 ms case mostly shows path B and
 * sometimes path A, so both outlets are asserted hidden in both tests.)
 */
test.describe('redirect from a pushed tab route', () => {
  test('redirect mid-transition: only the Apple outlet stays visible (path A)', async ({ page }) => {
    await page.goto('/redirect-stale-commit/apple');
    await ionPageVisible(page, 'redirect-apple');

    await page.locator('#tab-orange').click();
    await ionPageVisible(page, 'redirect-orange');

    await page.locator('#redirect-manual').click();

    // Redirect while the forward transition is in flight. The whole
    // transition lasts only ~30 ms in this environment and a Playwright
    // round-trip takes about as long, so the wait and the click both happen
    // inside the page: poll on requestAnimationFrame and click as soon as
    // the entering Banana outlet is shown while the leaving Orange outlet
    // is still visible.
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const check = () => {
          const banana = document.querySelector('#banana-outlet');
          const orange = document.querySelector('#orange-outlet');
          const button = document.querySelector('#redirect-now') as HTMLElement | null;
          if (
            banana !== null &&
            orange !== null &&
            button !== null &&
            !banana.classList.contains('ion-page-hidden') &&
            !orange.classList.contains('ion-page-hidden')
          ) {
            button.click();
            resolve();
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      });
    });

    await expect(page).toHaveURL(/\/redirect-stale-commit\/apple$/);
    await ionPageVisible(page, 'redirect-apple');
    await expect(page.locator('#banana-outlet')).toHaveClass(/ion-page-hidden/);
    await expect(page.locator('#orange-outlet')).toHaveClass(/ion-page-hidden/);
    await expect(page.locator('#apple-outlet')).not.toHaveClass(/ion-page-hidden/);
  });

  test('0 ms redirect: only the Apple outlet stays visible (path B)', async ({ page }) => {
    await page.goto('/redirect-stale-commit/apple');
    await ionPageVisible(page, 'redirect-apple');

    await page.locator('#tab-orange').click();
    await ionPageVisible(page, 'redirect-orange');

    await page.locator('#redirect-0ms').click();

    await expect(page).toHaveURL(/\/redirect-stale-commit\/apple$/);
    await ionPageVisible(page, 'redirect-apple');
    await expect(page.locator('#orange-outlet')).toHaveClass(/ion-page-hidden/);
    await expect(page.locator('#banana-outlet')).toHaveClass(/ion-page-hidden/);
    await expect(page.locator('#apple-outlet')).not.toHaveClass(/ion-page-hidden/);
  });
});
