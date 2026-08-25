import type { Page } from '@playwright/test';

/**
 * Drag an element by a given number of pixels.
 * Uses page.mouse with intermediate steps for gesture recognition.
 */
export const dragElementBy = async (
  page: Page,
  selector: string,
  dragByX = 0,
  dragByY = 0
): Promise<void> => {
  const el = page.locator(selector).first();
  const box = await el.boundingBox();
  if (!box) throw new Error(`Element not found or not visible: ${selector}`);

  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + dragByX, startY + dragByY, { steps: 10 });
  await page.mouse.up();
};

/**
 * Simulate iOS swipe-to-go-back gesture on a router outlet.
 *
 * Ionic's gesture recognizer requires:
 * 1. mousedown near the left edge (within ~50px)
 * 2. Multiple intermediate mousemove events to establish velocity
 * 3. mouseup to complete or abort
 *
 * @param page Playwright page
 * @param complete If true, swipe far enough to trigger back navigation.
 *                 If false, swipe a small amount then release (abort).
 * @param outletSelector CSS selector for the ion-router-outlet to swipe on.
 */
export const ionSwipeToGoBack = async (
  page: Page,
  complete = false,
  outletSelector = 'ion-router-outlet'
): Promise<void> => {
  const outlet = page.locator(outletSelector).first();
  const box = await outlet.boundingBox();
  if (!box) throw new Error(`Router outlet not found or not visible: ${outletSelector}`);

  const startX = box.x;
  const endX = complete ? box.x + box.width - 50 : box.x + 25;
  const y = box.y + box.height / 2;

  const urlBefore = page.url();

  await page.mouse.move(startX, y);
  await page.mouse.down();
  // steps: 10 produces intermediate mousemove events essential for gesture recognition
  await page.mouse.move(endX, y, { steps: 10 });
  await page.mouse.up();

  if (complete) {
    // Wait for goBack() to trigger the URL change, confirming navigation completed.
    // Falls back to a fixed timeout if the URL doesn't change (abort edge cases).
    await page.waitForURL((url) => url.toString() !== urlBefore, { timeout: 3000 })
      .catch((e: Error) => { if (e.name !== 'TimeoutError') throw e; });
  }

  // Small settle time for the transition animation to finish
  await page.waitForTimeout(150);
};
