import { expect, type Page } from '@playwright/test';

/**
 * Captures all CSS class changes on an element during an action.
 *
 * Installs a MutationObserver before the action runs, executes the action,
 * then disconnects the observer and returns the recorded class history.
 */
export async function captureClassChanges(
  page: Page,
  selector: string,
  action: () => Promise<void>
): Promise<string[]> {
  await page.evaluate((sel: string) => {
    // Disconnect any prior observer left over from a previous capture that
    // never reached its read path (e.g., the action threw).
    (window as any).__ionClassCaptureObs?.disconnect();
    (window as any).__ionClassCapture = [];
    const el = document.querySelector(sel);
    if (!el) {
      throw new Error(`captureClassChanges: no element matched ${sel}`);
    }
    const obs = new MutationObserver(() => {
      (window as any).__ionClassCapture.push((el as HTMLElement).className);
    });
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    (window as any).__ionClassCaptureObs = obs;
  }, selector);

  try {
    await action();
  } finally {
    await page.evaluate(() => {
      (window as any).__ionClassCaptureObs?.disconnect();
    });
  }

  return page.evaluate(() => ((window as any).__ionClassCapture ?? []) as string[]);
}

/**
 * Asserts that a CSS class was NEVER applied during the captured class history.
 * Used to verify ion-page-hidden (display:none) was not applied during a
 * transition, which would cause a blank flash.
 */
export function assertClassNeverApplied(classHistory: string[], className: string): void {
  const wasApplied = classHistory.some((c) => c.includes(className));
  expect(wasApplied, `"${className}" was unexpectedly applied during transition`).toBe(false);
}

/**
 * Observes a router-outlet for any descendant receiving ion-page-invisible
 * during an action. Subtree observation catches elements created mid-action
 * (entering pages don't exist in the DOM before navigation starts).
 */
export async function didChildReceiveInvisibleClass(
  page: Page,
  outletSelector: string,
  action: () => Promise<void>
): Promise<boolean> {
  await page.evaluate((sel: string) => {
    (window as any).__ionInvisibleObs?.disconnect();
    (window as any).__ionSawInvisible = false;
    const outlet = document.querySelector(sel);
    if (!outlet) {
      throw new Error(`didChildReceiveInvisibleClass: no element matched ${sel}`);
    }
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === 'attributes' &&
          (m.target as HTMLElement).classList?.contains('ion-page-invisible')
        ) {
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
    obs.observe(outlet, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true,
    });
    (window as any).__ionInvisibleObs = obs;
  }, outletSelector);

  try {
    await action();
  } finally {
    await page.evaluate(() => {
      (window as any).__ionInvisibleObs?.disconnect();
    });
  }

  return page.evaluate(() => (window as any).__ionSawInvisible as boolean);
}

/**
 * Waits for animations on the target element or any descendant to complete.
 * Ionic page transitions animate inner wrappers, not the page root, so a
 * target-only filter would return immediately and miss the transition.
 */
export async function waitForAnimationsComplete(page: Page, selector: string): Promise<void> {
  await page.evaluate(async (sel: string) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const anims = document.getAnimations().filter((a) => {
      const target = (a.effect as KeyframeEffect)?.target as Node | null;
      return !!target && (target === el || el.contains(target));
    });
    await Promise.all(anims.map((a) => a.finished));
  }, selector);
}
