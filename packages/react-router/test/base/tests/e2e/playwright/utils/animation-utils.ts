import { expect, type Page } from '@playwright/test';

/**
 * Captures all CSS class changes on an element during an action.
 *
 * Installs a MutationObserver before the action runs, executes the action,
 * then disconnects the observer and returns the recorded class history.
 *
 * Usage:
 *   const history = await captureClassChanges(page, '[data-pageid="home"]', async () => {
 *     await page.locator('ion-item').click();
 *     await ionPageVisible(page, 'details');
 *   });
 *   assertClassNeverApplied(history, 'ion-page-hidden');
 */
export async function captureClassChanges(
  page: Page,
  selector: string,
  action: () => Promise<void>
): Promise<string[]> {
  // Install observer before the action
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    (window as any).__ionClassCapture = [];
    if (!el) return;
    const obs = new MutationObserver(() => {
      (window as any).__ionClassCapture.push((el as HTMLElement).className);
    });
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    (window as any).__ionClassCaptureObs = obs;
  }, selector);

  // Execute the action (e.g., click a link and wait for page transition)
  await action();

  // Read and disconnect
  return page.evaluate(() => {
    (window as any).__ionClassCaptureObs?.disconnect();
    return ((window as any).__ionClassCapture ?? []) as string[];
  });
}

/**
 * Asserts that a CSS class was NEVER applied during the captured class history.
 * Used to verify that ion-page-hidden (display:none) was not applied during
 * a transition, which would cause a blank flash.
 */
export function assertClassNeverApplied(classHistory: string[], className: string): void {
  const wasApplied = classHistory.some((c) => c.includes(className));
  expect(wasApplied, `"${className}" was unexpectedly applied during transition`).toBe(false);
}

/**
 * Asserts that a CSS class appeared at some point during the captured history
 * but is NOT present in the final snapshot. This proves a transition animation
 * actually ran (e.g., ion-page-invisible was added then removed).
 */
export function assertTransitionalClass(classHistory: string[], className: string): void {
  expect(classHistory.length, `No class mutations were captured — observer may not have matched the element`).toBeGreaterThan(0);
  const wasPresent = classHistory.some((c) => c.includes(className));
  const isGoneAtEnd = !classHistory[classHistory.length - 1].includes(className);
  expect(wasPresent, `Expected "${className}" to appear during transition`).toBe(true);
  expect(isGoneAtEnd, `Expected "${className}" to be removed after transition`).toBe(true);
}

/**
 * Observes a router-outlet for any child element receiving ion-page-invisible
 * during an action. Used to verify that entering pages go through the
 * invisible → visible animation lifecycle.
 *
 * Unlike captureClassChanges (which observes a specific existing element),
 * this observes the outlet container with subtree: true to catch class changes
 * on elements that are created during the action (entering pages that don't
 * exist in the DOM before navigation starts).
 */
export async function didChildReceiveInvisibleClass(
  page: Page,
  outletSelector: string,
  action: () => Promise<void>
): Promise<boolean> {
  await page.evaluate((sel) => {
    (window as any).__ionSawInvisible = false;
    const outlet = document.querySelector(sel);
    if (!outlet) return;
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && (m.target as HTMLElement).classList?.contains('ion-page-invisible')) {
          (window as any).__ionSawInvisible = true;
        }
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if ((n as HTMLElement).classList?.contains('ion-page-invisible')) {
              (window as any).__ionSawInvisible = true;
            }
          });
        }
      }
    });
    obs.observe(outlet, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
    (window as any).__ionInvisibleObs = obs;
  }, outletSelector);

  await action();

  return page.evaluate(() => {
    (window as any).__ionInvisibleObs?.disconnect();
    return (window as any).__ionSawInvisible as boolean;
  });
}

/**
 * Checks whether any CSS animations or transitions ran on an element during an action.
 * Uses the Web Animations API (document.getAnimations()).
 *
 * Note: This has a race condition if the animation completes before evaluate fires.
 * Best used for animations longer than ~300ms. For shorter animations, prefer
 * captureClassChanges + assertTransitionalClass.
 */
export async function didElementAnimate(
  page: Page,
  selector: string,
  action: () => Promise<void>
): Promise<boolean> {
  // Record animation count before
  const beforeCount = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return 0;
    return document.getAnimations().filter((a) => (a.effect as KeyframeEffect)?.target === el).length;
  }, selector);

  await action();

  // Check for new or finished animations
  return page.evaluate(
    ({ sel, before }) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const anims = document.getAnimations().filter((a) => (a.effect as KeyframeEffect)?.target === el);
      return anims.length > before || anims.some((a) => a.playState === 'finished');
    },
    { sel: selector, before: beforeCount }
  );
}

/**
 * Waits for all running animations on an element to complete.
 * Use after triggering navigation when animations are enabled.
 */
export async function waitForAnimationsComplete(page: Page, selector: string): Promise<void> {
  await page.evaluate(async (sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const anims = document.getAnimations().filter((a) => (a.effect as KeyframeEffect)?.target === el);
    await Promise.all(anims.map((a) => a.finished));
  }, selector);
}
