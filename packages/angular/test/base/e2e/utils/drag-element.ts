import type { Locator, Page } from '@playwright/test';

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
