import { test, expect } from '@playwright/test';
import { ionPageHidden, ionPageVisible } from './utils/test-utils';

const IOS_MODE = 'ionic:mode=ios';

/**
 * Regression test for ionic-team/ionic-framework#31708: in iOS mode, an
 * `ionPage` child outlet can end up with two visible pages. The page that
 * was active when the user left the outlet (Step 2) is never hidden, so
 * when the user later returns to a different page in the same outlet
 * (Step 1), the old page stays on screen and covers the new one.
 *
 * The extra Settings step matters: going straight from Home back to Step 1
 * leaves `prevRouteLastPathname` at `/onboarding/step2`, so Step 2 is found
 * as the leaving view and hidden. Any two navigations outside the outlet
 * before returning trigger the bug.
 */
test.describe('swipe-preserved page stays visible', () => {
  test('only the current page is visible when re-entering the outlet at a different page', async ({ page }) => {
    await page.goto(`/swipe-preserved-page/onboarding/step1?${IOS_MODE}`);
    await ionPageVisible(page, 'swipe-step-1');

    await page.locator('#go-to-step2').click();
    await ionPageVisible(page, 'swipe-step-2');

    await page.locator('#go-to-home').click();
    await ionPageVisible(page, 'swipe-home');

    await page.locator('#go-to-settings').click();
    await ionPageVisible(page, 'swipe-settings');

    await page.locator('#back-to-step1').click();
    await ionPageVisible(page, 'swipe-step-1');

    await expect(page).toHaveURL(/\/swipe-preserved-page\/onboarding\/step1$/);
    await ionPageHidden(page, 'swipe-step-2');
  });
});
