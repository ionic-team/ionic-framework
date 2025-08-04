import type { Locator, Page } from '@playwright/test';

// Drag an element by a given amount of pixels
export const dragElementBy = async (
  element: Locator,
  page: Page,
  dragByX = 0,
  dragByY = 0
) => {
  const boundingBox = await element.boundingBox();
  if (!boundingBox) {
    throw new Error('Element not visible');
  }

  const startX = boundingBox.x + boundingBox.width / 2;
  const startY = boundingBox.y + boundingBox.height / 2;
  const endX = startX + dragByX;
  const endY = startY + dragByY;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY);
  await page.mouse.up();
};

// Simulate swipe gesture for going back
export const ionSwipeToGoBack = async (page: Page, shouldGoBack = false) => {
  const viewport = page.viewportSize();
  if (!viewport) return;

  const startX = 50;
  const endX = shouldGoBack ? viewport.width - 50 : 50;
  const y = viewport.height / 2;

  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y);
  await page.mouse.up();
}
