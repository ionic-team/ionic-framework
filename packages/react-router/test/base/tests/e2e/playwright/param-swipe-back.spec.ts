import { test, expect } from '@playwright/test';
import { ionPageVisible, ionPageHidden, ionPageDoesNotExist, ionGoBack, withTestingMode } from './utils/test-utils';
import { ionSwipeToGoBack } from './utils/drag-utils';

const IOS_MODE = 'ionic:mode=ios';

/**
 * Tests for issue #27900:
 * Swipe back gesture breaks with Ionic React Router on certain parameterized route changes.
 *
 * Two reproductions from the issue:
 * A) /foo/alex -> /baz -> /foo/sean -> swipe back (ok) -> swipe back (broken)
 * B) /one -> replace /two -> /two/details -> swipe back (broken)
 */
test.describe('Param Back Navigation (#27900)', () => {

  // --- Reproduction A ---
  // Routes: /user/:name and /middle
  // Navigate /user/alex -> /middle -> /user/sean -> back -> back
  // Second back should go to /user/alex

  test('Repro A: browser back through param routes with non-param in between', async ({ page }) => {
    await page.goto(withTestingMode('/param-swipe-back'));
    await ionPageVisible(page, 'psb-start');

    // 1. Navigate /user/alex
    await page.locator('[data-pageid="psb-start"] #go-to-alex').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-user-alex');

    // 2. Navigate /middle
    await page.locator('[data-pageid="psb-user-alex"] #go-to-middle').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-middle');

    // 3. Navigate /user/sean
    await page.locator('[data-pageid="psb-middle"] #go-to-sean').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-user-sean');

    // 4. Back → /middle
    await ionGoBack(page, '/param-swipe-back/middle');
    await ionPageVisible(page, 'psb-middle');
    await ionPageDoesNotExist(page, 'psb-user-sean');

    // 5. Back → /user/alex (this is the step that broke in #27900)
    await ionGoBack(page, '/param-swipe-back/user/alex');
    await ionPageVisible(page, 'psb-user-alex');
    await ionPageDoesNotExist(page, 'psb-middle');
  });

  test('Repro A: swipe back through param routes with non-param in between', async ({ page }) => {
    await page.goto(`/param-swipe-back?${IOS_MODE}`);
    await ionPageVisible(page, 'psb-start');

    await page.locator('[data-pageid="psb-start"] #go-to-alex').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-user-alex');
    await ionPageHidden(page, 'psb-start');

    await page.locator('[data-pageid="psb-user-alex"] #go-to-middle').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-middle');
    await ionPageHidden(page, 'psb-user-alex');

    await page.locator('[data-pageid="psb-middle"] #go-to-sean').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-user-sean');
    await ionPageHidden(page, 'psb-middle');

    // 4. Swipe back → /middle
    await ionSwipeToGoBack(page, true, 'ion-router-outlet#param-swipe-back');
    await ionPageVisible(page, 'psb-middle');
    await ionPageDoesNotExist(page, 'psb-user-sean');

    // 5. Swipe back → /user/alex
    await ionSwipeToGoBack(page, true, 'ion-router-outlet#param-swipe-back');
    await ionPageVisible(page, 'psb-user-alex');
    await ionPageDoesNotExist(page, 'psb-middle');
  });

  // --- Reproduction B ---
  // Routes: /item/:name and /item/:name/details
  // Navigate /item/one -> replace with /item/two -> /item/two/details -> back
  // Back should return to /item/two

  test('Repro B: browser back after replace + parameterized details route', async ({ page }) => {
    // 1. Go to /item/one
    await page.goto(withTestingMode('/param-swipe-back-b/item/one'));
    await ionPageVisible(page, 'psb-item-one');

    // 2. Replace route with /item/two
    await page.locator('#replace-with-two').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-item-two');

    // 3. Go to /item/two/details
    await page.locator('[data-pageid="psb-item-two"] #go-to-details').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-item-two-details');

    // 4. Back → should return to /item/two
    await ionGoBack(page, '/param-swipe-back-b/item/two');
    await ionPageVisible(page, 'psb-item-two');
    await ionPageDoesNotExist(page, 'psb-item-two-details');
  });

  test('Repro B: swipe back after replace + parameterized details route', async ({ page }) => {
    // 1. Go to /item/one
    await page.goto(`/param-swipe-back-b/item/one?${IOS_MODE}`);
    await ionPageVisible(page, 'psb-item-one');

    // 2. Replace route with /item/two
    await page.locator('#replace-with-two').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-item-two');

    // 3. Go to /item/two/details
    await page.locator('[data-pageid="psb-item-two"] #go-to-details').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'psb-item-two-details');
    await ionPageHidden(page, 'psb-item-two');

    // 4. Swipe back → should return to /item/two
    await ionSwipeToGoBack(page, true, 'ion-router-outlet#param-swipe-back-b');
    await ionPageVisible(page, 'psb-item-two');
    await ionPageDoesNotExist(page, 'psb-item-two-details');
  });
});
