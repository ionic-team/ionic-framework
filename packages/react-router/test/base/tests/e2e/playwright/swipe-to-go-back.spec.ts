import { test, expect } from '@playwright/test';
import { ionPageVisible, ionPageHidden, ionPageDoesNotExist, ionNav } from './utils/test-utils';
import { ionSwipeToGoBack } from './utils/drag-utils';

const IOS_MODE = 'ionic:mode=ios';

test.describe('Swipe To Go Back', () => {
  /*
    This spec tests that swipe to go back works.
    Animations must be enabled (no ionic:_testing=true) for gesture tests.
  */

  test('should swipe and abort', async ({ page }) => {
    await page.goto(`/swipe-to-go-back?${IOS_MODE}`);
    await ionPageVisible(page, 'main');

    await ionNav(page, 'ion-item', 'Details');
    await ionPageVisible(page, 'details');
    await ionPageHidden(page, 'main');

    await ionSwipeToGoBack(page, false, 'ion-router-outlet#swipe-to-go-back');
    await ionPageVisible(page, 'details');
    await ionPageHidden(page, 'main');
  });

  test('should swipe and go back', async ({ page }) => {
    await page.goto(`/swipe-to-go-back?${IOS_MODE}`);
    await ionPageVisible(page, 'main');

    await ionNav(page, 'ion-item', 'Details');
    await ionPageVisible(page, 'details');
    await ionPageHidden(page, 'main');

    await ionSwipeToGoBack(page, true, 'ion-router-outlet#swipe-to-go-back');
    await ionPageVisible(page, 'main');
  });

  test('should render details page when navigating directly to nested route', async ({ page }) => {
    await page.goto(`/swipe-to-go-back/details?${IOS_MODE}`);
    await ionPageVisible(page, 'details');

    await expect(page.locator('[data-pageid="details"]')).toBeVisible();
    await expect(page.locator('[data-pageid="details"] ion-content')).toContainText('Details');
  });

  test('should swipe and abort within a tab', async ({ page }) => {
    await page.goto(`/tabs/tab1?${IOS_MODE}`);
    await ionPageVisible(page, 'tab1');

    await page.locator('#child-one').click();
    await ionPageHidden(page, 'tab1');
    await ionPageVisible(page, 'tab1child1');

    await ionSwipeToGoBack(page, false, 'ion-tabs ion-router-outlet');

    await ionPageHidden(page, 'tab1');
    await ionPageVisible(page, 'tab1child1');
  });

  test('should swipe and go back within a tab', async ({ page }) => {
    await page.goto(`/tabs/tab1?${IOS_MODE}`);
    await ionPageVisible(page, 'tab1');

    await page.locator('#child-one').click();
    await ionPageHidden(page, 'tab1');
    await ionPageVisible(page, 'tab1child1');

    await ionSwipeToGoBack(page, true, 'ion-tabs ion-router-outlet');

    await ionPageVisible(page, 'tab1');
    await ionPageDoesNotExist(page, 'tab1child1');
  });

  test('should swipe and go back to correct tab after switching tabs', async ({ page }) => {
    await page.goto(`/?${IOS_MODE}`);
    await ionPageVisible(page, 'home');

    await page.locator('#go-to-tabs').click();
    await ionPageHidden(page, 'home');
    await ionPageVisible(page, 'tab1');
    await ionPageVisible(page, 'tabs');

    await page.locator('#child-one').click();
    await ionPageHidden(page, 'tab1');
    await ionPageVisible(page, 'tab1child1');

    await page.locator('ion-tab-button#tab-button-tab2').click();
    await ionPageVisible(page, 'tab2');
    await ionPageHidden(page, 'tab1child1');

    await page.locator('ion-tab-button#tab-button-tab1').click();
    await ionPageVisible(page, 'tab1child1');
    await ionPageHidden(page, 'tab2');

    await ionSwipeToGoBack(page, true, 'ion-tabs ion-router-outlet');

    await ionPageVisible(page, 'tab1');
    await ionPageDoesNotExist(page, 'tab1child1');

    await ionSwipeToGoBack(page, true, 'ion-tabs ion-router-outlet');
    await ionPageVisible(page, 'home');
    await ionPageDoesNotExist(page, 'tabs');
  });

  test('should be able to swipe back from child tab page after visiting', async ({ page }) => {
    await page.goto(`/tabs/tab1?${IOS_MODE}`);
    await ionPageVisible(page, 'tab1');

    await page.locator('#child-one').click();
    await ionPageHidden(page, 'tab1');
    await ionPageVisible(page, 'tab1child1');

    await page.locator('#child-two').click();
    await ionPageHidden(page, 'tab1child1');
    await ionPageVisible(page, 'tab1child2');

    await ionSwipeToGoBack(page, true, 'ion-tabs ion-router-outlet');

    await ionPageDoesNotExist(page, 'tab1child2');
    await ionPageVisible(page, 'tab1child1');

    await ionSwipeToGoBack(page, true, 'ion-tabs ion-router-outlet');

    await ionPageDoesNotExist(page, 'tab1child1');
    await ionPageVisible(page, 'tab1');

    await page.locator('#child-one').click();
    await ionPageHidden(page, 'tab1');
    await ionPageVisible(page, 'tab1child1');

    await ionSwipeToGoBack(page, true, 'ion-tabs ion-router-outlet');

    await ionPageDoesNotExist(page, 'tab1child1');
    await ionPageVisible(page, 'tab1');
  });

  test('should not swipe to go back to the same view you are on', async ({ page }) => {
    await page.goto(`/?${IOS_MODE}`);
    await ionPageVisible(page, 'home');

    await ionSwipeToGoBack(page, false);
    await ionPageVisible(page, 'home');
  });

  test('should not hide a parameterized page when swiping and aborting', async ({ page }) => {
    await page.goto(`/params/0?${IOS_MODE}`);
    await ionPageVisible(page, 'params-0');

    await page.locator('#next-page').click();
    await ionPageVisible(page, 'params-1');

    await ionSwipeToGoBack(page, false);

    await ionPageVisible(page, 'params-1');
  });

  test('should keep correct view visible after swipe-back completes then abort on previous page', async ({ page }) => {
    // Navigate three levels deep: main -> details -> details2
    await page.goto(`/swipe-to-go-back?${IOS_MODE}`);
    await ionPageVisible(page, 'main');

    await ionNav(page, 'ion-item', 'Details');
    await ionPageVisible(page, 'details');
    await ionPageHidden(page, 'main');

    await page.locator('#go-to-details2').click();
    await page.waitForTimeout(250);
    await ionPageVisible(page, 'details2');
    await ionPageHidden(page, 'details');

    // Complete swipe back from details2 -> details
    await ionSwipeToGoBack(page, true, 'ion-router-outlet#swipe-to-go-back');
    await ionPageVisible(page, 'details');
    await ionPageDoesNotExist(page, 'details2');

    // Now on details, abort a swipe back toward main
    // This validates that the abort doesn't hide the currently-visible page
    await ionSwipeToGoBack(page, false, 'ion-router-outlet#swipe-to-go-back');
    await ionPageVisible(page, 'details');
    await ionPageHidden(page, 'main');
  });

  test('should handle multiple consecutive swipe aborts without hiding current page', async ({ page }) => {
    await page.goto(`/swipe-to-go-back?${IOS_MODE}`);
    await ionPageVisible(page, 'main');

    await ionNav(page, 'ion-item', 'Details');
    await ionPageVisible(page, 'details');
    await ionPageHidden(page, 'main');

    // First abort
    await ionSwipeToGoBack(page, false, 'ion-router-outlet#swipe-to-go-back');
    await ionPageVisible(page, 'details');
    await ionPageHidden(page, 'main');

    // Second abort
    await ionSwipeToGoBack(page, false, 'ion-router-outlet#swipe-to-go-back');
    await ionPageVisible(page, 'details');
    await ionPageHidden(page, 'main');

    // Third abort
    await ionSwipeToGoBack(page, false, 'ion-router-outlet#swipe-to-go-back');
    await ionPageVisible(page, 'details');
    await ionPageHidden(page, 'main');
  });

  test('should not swipe back when swipeGesture is false', async ({ page }) => {
    await page.goto(`/swipe-to-go-back-disabled?${IOS_MODE}`);
    await ionPageVisible(page, 'disabled-main');

    await ionNav(page, 'ion-item', 'Details');
    await ionPageVisible(page, 'disabled-details');
    await ionPageHidden(page, 'disabled-main');

    // Attempt a full swipe -- should not go back since gesture is disabled
    await ionSwipeToGoBack(page, true, 'ion-router-outlet#swipe-to-go-back-disabled');
    await ionPageVisible(page, 'disabled-details');
    await ionPageHidden(page, 'disabled-main');
  });
});
