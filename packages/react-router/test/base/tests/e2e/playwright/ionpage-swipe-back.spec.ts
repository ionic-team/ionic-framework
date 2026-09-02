import { test, expect } from '@playwright/test';
import { ionPageVisible } from './utils/test-utils';
import { ionSwipeToGoBack } from './utils/drag-utils';

const IOS_MODE = 'ionic:mode=ios';

/**
 * Tests that swipe-to-go-back works correctly for ionPage outlets
 * (nested IonRouterOutlet components with the ionPage prop).
 *
 * Bug: when navigating from one ionPage outlet (section-a) to a sibling
 * (section-b), the previous outlet's child content was destroyed by the
 * deferred unmount. During swipe-back, the entering page was an empty shell.
 *
 * Root causes:
 * 1. When the current outlet had no matching view, the fallback search
 *    across all outlets accepted any candidate without verifying the
 *    candidate's page element actually lives inside the current outlet.
 *    A nested child outlet could then run the swipe gesture on a sibling's
 *    view, driving the transition on the wrong router outlet.
 * 2. The deferred unmount in handleOutOfScopeOutlet removed section-a's child
 *    content before the swipe gesture could reveal it.
 */
test.describe('ionPage outlet swipe-to-go-back', () => {
  test('section-a content should be visible during swipe-back from section-b', async ({ page }) => {
    // Navigate to modal-aria-hidden test page (has sibling ionPage outlets)
    await page.goto(`/modal-aria-hidden?${IOS_MODE}`);
    await ionPageVisible(page, 'modal-page-a');

    // Open modal and navigate to Section B without dismissing
    await page.locator('#openModal').click();
    await page.locator('ion-modal').waitFor({ state: 'visible' });
    await page.locator('#navigateToB').click();
    await ionPageVisible(page, 'modal-page-b');

    // Wait for the forward-transition to fully commit before starting the swipe.
    // ionPageVisible resolves as soon as the entering page-b clears its hidden
    // state, which can fire before the parent outlet's animation completes. On
    // slower runners (CI), the parent animation was still in flight when the
    // swipe mouse events were dispatched, so the swipe-back gesture never
    // started and section-a was then hidden by the tail of the forward commit.
    // Waiting for section-a to actually carry `ion-page-hidden` guarantees the
    // forward transition is done and the gesture can take over cleanly.
    await page.locator('#section-a.ion-page-hidden').waitFor({ state: 'attached' });

    // Start a swipe-back gesture and hold mid-way
    const outlet = page.locator('ion-router-outlet#modal-aria-hidden-root');
    const box = await outlet.boundingBox();
    if (!box) throw new Error('Root outlet not found');

    await page.mouse.move(box.x, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
    await page.waitForTimeout(300);

    // Mid-swipe: section-a should be visible (not display:none) with its child content
    const sectionA = page.locator('#section-a');
    const computedDisplay = await sectionA.evaluate((el: HTMLElement) => getComputedStyle(el).display);
    expect(computedDisplay).not.toBe('none');

    const pageACount = await sectionA.locator('[data-pageid="modal-page-a"]').count();
    expect(pageACount).toBe(1);

    // Release the gesture
    await page.mouse.up();
  });

  test('should abort swipe-back and stay on section-b', async ({ page }) => {
    await page.goto(`/modal-aria-hidden?${IOS_MODE}`);
    await ionPageVisible(page, 'modal-page-a');

    await page.locator('#openModal').click();
    await page.locator('ion-modal').waitFor({ state: 'visible' });
    await page.locator('#navigateToB').click();
    await ionPageVisible(page, 'modal-page-b');

    // Abort the swipe-back gesture (small swipe)
    await ionSwipeToGoBack(page, false, 'ion-router-outlet#modal-aria-hidden-root');

    // Should still be on section B
    await ionPageVisible(page, 'modal-page-b');
  });
});
