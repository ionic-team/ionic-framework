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
    page.on('console', (msg) => {
      // eslint-disable-next-line no-console
      console.log('BROWSER[' + msg.type() + ']:', msg.text());
    });
    page.on('pageerror', (err) => {
      // eslint-disable-next-line no-console
      console.log('PAGEERROR:', err.message);
    });

    // Navigate to modal-aria-hidden test page (has sibling ionPage outlets)
    await page.goto(`/modal-aria-hidden?${IOS_MODE}`);
    await ionPageVisible(page, 'modal-page-a');

    // Open modal and navigate to Section B without dismissing
    await page.locator('#openModal').click();
    await page.locator('ion-modal').waitFor({ state: 'visible' });
    await page.locator('#navigateToB').click();
    await ionPageVisible(page, 'modal-page-b');

    // Install a MutationObserver on section-a to catch anyone adding ion-page-hidden
    await page.evaluate(() => {
      const target = document.querySelector('#section-a');
      if (!target) {
        // eslint-disable-next-line no-console
        console.log('[MO-install] #section-a not found!');
        return;
      }
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style' || m.attributeName === 'aria-hidden')) {
            const el = m.target as HTMLElement;
            // eslint-disable-next-line no-console
            console.log('[MO-change]', JSON.stringify({
              attr: m.attributeName,
              oldValue: m.oldValue,
              newClass: el.className,
              newStyle: el.getAttribute('style'),
              newAriaHidden: el.getAttribute('aria-hidden'),
              stack: new Error().stack?.split('\n').slice(1, 8).map((s) => s.trim()),
            }));
          }
        }
      });
      obs.observe(target, { attributes: true, attributeOldValue: true });
      (window as any).__sectionAObserver = obs;
      // eslint-disable-next-line no-console
      console.log('[MO-install] observer attached to #section-a');
    });

    // Pre-swipe: dump section-a state
    const preSwipe = await page.locator('#section-a').evaluate((el: HTMLElement) => ({
      inlineDisplay: el.style.display,
      hasHiddenClass: el.classList.contains('ion-page-hidden'),
      ariaHidden: el.getAttribute('aria-hidden'),
      classList: Array.from(el.classList),
      computedDisplay: getComputedStyle(el).display,
    }));
    // eslint-disable-next-line no-console
    console.log('PRE_SWIPE section-a:', JSON.stringify(preSwipe));

    // Start a swipe-back gesture and hold mid-way
    const outlet = page.locator('ion-router-outlet#modal-aria-hidden-root');
    const box = await outlet.boundingBox();
    if (!box) throw new Error('Root outlet not found');
    // eslint-disable-next-line no-console
    console.log('OUTLET_BOX:', JSON.stringify(box));

    await page.mouse.move(box.x, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
    await page.waitForTimeout(300);

    // Post-swipe: dump section-a state before the assertion
    const postSwipe = await page.locator('#section-a').evaluate((el: HTMLElement) => ({
      inlineDisplay: el.style.display,
      hasHiddenClass: el.classList.contains('ion-page-hidden'),
      ariaHidden: el.getAttribute('aria-hidden'),
      classList: Array.from(el.classList),
      computedDisplay: getComputedStyle(el).display,
      outerBounds: el.getBoundingClientRect().toJSON(),
    }));
    // eslint-disable-next-line no-console
    console.log('POST_SWIPE section-a:', JSON.stringify(postSwipe));

    // Also dump current URL to see if navigation fired
    // eslint-disable-next-line no-console
    console.log('POST_SWIPE url:', page.url());

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
