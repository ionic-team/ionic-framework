import { test, expect } from '@playwright/test';
import { ionPageVisible, ionPageHidden, routerPush, ionBackClick, ionSwipeToGoBack } from './utils/test-utils';
import {
  captureClassChanges,
  assertClassNeverApplied,
  didChildReceiveInvisibleClass,
  waitForAnimationsComplete,
} from './utils/animation-utils';

/**
 * Animation correctness tests for the @ionic/vue-router transition pipeline.
 *
 * These tests intentionally do NOT pass ionic:_testing=true; animations must
 * actually run for the assertions to be meaningful. iOS mode is forced because
 * its forward push is the most visible animation and the one that historically
 * regressed (e.g. ion-page-hidden flashing the leaving page).
 */

test.describe('Vue Router Animations', () => {
  // Regression for the family of bugs where the leaving page is hidden too
  // early during a transition, producing a blank flash. ion-page-hidden
  // applies display:none, so it must never appear on the leaving page while
  // the entering animation is running.
  test('forward push: leaving page never receives ion-page-hidden mid-transition', async ({ page }) => {
    await page.goto('/?ionic:mode=ios');
    await ionPageVisible(page, 'home');

    const classHistory = await captureClassChanges(
      page,
      'div.ion-page[data-pageid="home"]',
      async () => {
        await page.locator('ion-item#routing').click({ force: true });
        await ionPageVisible(page, 'routing');
        await waitForAnimationsComplete(page, 'div.ion-page[data-pageid="routing"]');
      }
    );

    // After the transition completes, ion-page-hidden is the expected
    // resting state for the leaving page, but it must not have been the
    // first transition class applied. Strip the final entry to verify that.
    assertClassNeverApplied(classHistory.slice(0, -1), 'ion-page-hidden');
    await ionPageHidden(page, 'home');
  });

  // The entering page must go through ion-page-invisible (opacity:0) before
  // becoming visible so the animation has a starting state. If this stops
  // happening, the new page would pop in instantly without the iOS slide.
  test('forward push: entering page goes through ion-page-invisible', async ({ page }) => {
    await page.goto('/?ionic:mode=ios');
    await ionPageVisible(page, 'home');

    const sawInvisible = await didChildReceiveInvisibleClass(
      page,
      'ion-router-outlet',
      async () => {
        await page.locator('ion-item#routing').click({ force: true });
        await ionPageVisible(page, 'routing');
      }
    );

    expect(
      sawInvisible,
      'Entering page should receive ion-page-invisible during transition'
    ).toBe(true);
  });

  // Back navigation: the leaving page (going off-screen) should animate out
  // and end up either ion-page-hidden or removed; the entering page should
  // end visible. Forward push has its own no-flash test above; we only need
  // to verify that back nav still produces a real animation, not an instant
  // jump. didChildReceiveInvisibleClass works in both directions because the
  // entering page has to start invisible to give the animation a starting state.
  test('back nav triggers a real animation', async ({ page }) => {
    await page.goto('/?ionic:mode=ios');
    await routerPush(page, '/routing');
    await ionPageVisible(page, 'routing');

    const sawInvisible = await didChildReceiveInvisibleClass(
      page,
      'ion-router-outlet',
      async () => {
        await ionBackClick(page, 'routing');
        await ionPageVisible(page, 'home');
      }
    );

    expect(sawInvisible, 'Back nav should still animate (ion-page-invisible observed)').toBe(true);
  });

  // Sanity check that the swipe-to-go-back gesture is wired up: triggering
  // a small swipe on iOS-mode should at minimum not throw and the gesture
  // handler should be present (pages still mounted, no errors).
  // Note: the full gesture commit is exercised in cypress (tabs.cy.js,
  // routing.cy.js) but historically flaky there, so we keep this as a
  // smoke test that the gesture doesn't break the outlet.
  test('swipe-to-go-back: gesture does not corrupt the view stack on partial swipe', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/?ionic:mode=ios');
    await ionPageVisible(page, 'home');

    await page.locator('ion-item#routing').click({ force: true });
    await ionPageVisible(page, 'routing');
    await waitForAnimationsComplete(page, 'div.ion-page[data-pageid="routing"]');

    await ionSwipeToGoBack(page, false);

    // Stack stayed on /routing.
    await ionPageVisible(page, 'routing');
    await ionPageHidden(page, 'home');

    // The real corruption check: a regular back nav after the aborted swipe
    // must still land on home. If the swipe partially mutated the stack the
    // back-button click would either no-op or land on the wrong page.
    await ionBackClick(page, 'routing');
    await ionPageVisible(page, 'home');
  });
});
