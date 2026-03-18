import { test, expect } from '@playwright/test';
import { ionPageVisible } from './utils/test-utils';
import { captureClassChanges, assertClassNeverApplied, didChildReceiveInvisibleClass } from './utils/animation-utils';

test.describe('Transition Flash', () => {
  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/25477
  // Tests that navigating from a tab page to a non-tab page does not cause
  // the tab page content to vanish before the transition animation completes.
  // Bug: handleOutOfScopeOutlet immediately applied ion-page-hidden (display: none)
  // to tab views, causing the leaving page to flash blank during the forward transition.
  test('Tab 3 > Other Page: tab page should not flash blank during transition', async ({ page }) => {
    await page.goto('/routing/tabs/tab3?ionic:mode=ios');
    await ionPageVisible(page, 'tab3-page');

    const classHistory = await captureClassChanges(page, '[data-pageid="tab3-page"]', async () => {
      await page.locator('ion-button').filter({ hasText: 'Go to Other Page' }).click();
      await ionPageVisible(page, 'other-page');
    });

    assertClassNeverApplied(classHistory, 'ion-page-hidden');
  });

  // Verifies fix for https://github.com/ionic-team/ionic-framework/issues/25477
  // Same test as above but from the Home tab using routerLink navigation.
  // Scopes the click to the home page to avoid matching the menu's "Other Page" item.
  test('Home > Other Page: tab page should not flash blank during transition', async ({ page }) => {
    await page.goto('/routing/tabs/home?ionic:mode=ios');
    await ionPageVisible(page, 'home-page');

    const classHistory = await captureClassChanges(page, '[data-pageid="home-page"]', async () => {
      await page.locator('[data-pageid="home-page"] ion-item').filter({ hasText: 'Other Page' }).click();
      await ionPageVisible(page, 'other-page');
    });

    assertClassNeverApplied(classHistory, 'ion-page-hidden');
  });

  // Verifies that forward navigation actually triggers an animation.
  // The entering page should receive ion-page-invisible (opacity: 0) during the
  // transition, then have it removed when the animation completes.
  // Observes the router-outlet container since the entering page doesn't exist
  // in the DOM until React creates it during navigation.
  test('Forward transition should animate (ion-page-invisible lifecycle)', async ({ page }) => {
    await page.goto('/routing/tabs/home?ionic:mode=ios');
    await ionPageVisible(page, 'home-page');

    const sawInvisible = await didChildReceiveInvisibleClass(
      page,
      'ion-router-outlet#tabs',
      async () => {
        await page.locator('[data-pageid="home-page"] ion-item').filter({ hasText: 'Details 1' }).first().click();
        await ionPageVisible(page, 'home-details-page-1');
      }
    );

    expect(sawInvisible, 'Entering page should have had ion-page-invisible during transition').toBe(true);
  });

  // Verifies that the forward push from the swipe-to-go-back test page also animates.
  test('Swipe-to-go-back forward push should animate', async ({ page }) => {
    await page.goto('/swipe-to-go-back?ionic:mode=ios');
    await ionPageVisible(page, 'main');

    const sawInvisible = await didChildReceiveInvisibleClass(
      page,
      'ion-router-outlet#swipe-to-go-back',
      async () => {
        await page.locator('ion-item').filter({ hasText: 'Details' }).click();
        await ionPageVisible(page, 'details');
      }
    );

    expect(sawInvisible, 'Entering page should have had ion-page-invisible during transition').toBe(true);
  });
});
