import type { ElementHandle, Locator } from '@playwright/test';

import type { E2EPage } from './';

export const dragElementBy = async (
  el: Locator | ElementHandle<SVGElement | HTMLElement>,
  page: E2EPage,
  dragByX = 0,
  dragByY = 0,
  startXCoord?: number,
  startYCoord?: number
) => {
  const boundingBox = await el.boundingBox();

  if (!boundingBox) {
    throw new Error(
      'Cannot get a bounding box for an element that is not visible. See https://playwright.dev/docs/api/class-locator#locator-bounding-box for more information'
    );
  }

  const startX = startXCoord === undefined ? boundingBox.x + boundingBox.width / 2 : startXCoord;
  const startY = startYCoord === undefined ? boundingBox.y + boundingBox.height / 2 : startYCoord;

  const endX = startX + dragByX;
  const endY = startY + dragByY;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();
};

/**
 * Drags an element by the given amount of pixels on the Y axis.
 * @param el The element to drag.
 * @param page The E2E Page object.
 * @param dragByY The amount of pixels to drag the element by.
 * @param startYCoord The Y coordinate to start the drag gesture at. Defaults to the center of the element.
 */
export const dragElementByYAxis = async (
  el: Locator | ElementHandle<SVGElement | HTMLElement>,
  page: E2EPage,
  dragByY: number,
  startYCoord?: number
) => {
  const boundingBox = await el.boundingBox();

  if (!boundingBox) {
    throw new Error(
      'Cannot get a bounding box for an element that is not visible. See https://playwright.dev/docs/api/class-locator#locator-bounding-box for more information'
    );
  }

  const startX = boundingBox.x + boundingBox.width / 2;
  const startY = startYCoord === undefined ? boundingBox.y + boundingBox.height / 2 : startYCoord;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  for (let i = 0; i < dragByY; i += 20) {
    await page.mouse.move(startX, startY + i);
  }

  await page.mouse.up();
};
