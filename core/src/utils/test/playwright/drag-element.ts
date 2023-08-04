/**
 * The drag gesture will not operate as expected when the element is dragged outside of the viewport because the Mouse class does not fire events outside of the viewport.
 *
 * For example, if the mouse is moved outside of the viewport, then the `mouseup` event will not fire.
 *
 * See https://playwright.dev/docs/api/class-mouse#mouse-move for more information.
 */

import type { ElementHandle, Locator } from '@playwright/test';

import type { E2EPage } from './';

export const dragElementBy = async (
  el: Locator | ElementHandle<SVGElement | HTMLElement>,
  page: E2EPage,
  dragByX = 0,
  dragByY = 0,
  startXCoord?: number,
  startYCoord?: number,
  releaseDrag = true
) => {
  const boundingBox = await el.boundingBox();

  if (!boundingBox) {
    throw new Error(
      'Cannot get a bounding box for an element that is not visible. See https://playwright.dev/docs/api/class-locator#locator-bounding-box for more information'
    );
  }

  const startX = startXCoord === undefined ? boundingBox.x + boundingBox.width / 2 : startXCoord;
  const startY = startYCoord === undefined ? boundingBox.y + boundingBox.height / 2 : startYCoord;

  // Navigate to the start position.
  await page.mouse.move(startX, startY);

  await page.mouse.down();

  // Drag the element.
  await moveElement(page, startX, startY, dragByX, dragByY);

  if (releaseDrag) {
    await page.mouse.up();
  }
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

  // Navigate to the start position.
  await page.mouse.move(startX, startY);
  await page.mouse.down();

  // Drag the element.
  await moveElement(page, startX, startY, 0, dragByY);

  await page.mouse.up();
};

const calculateEndX = (startX: number, dragByX: number, viewportWidth: number) => {
  let endX = startX + dragByX;
  // The element is being dragged past the right of the viewport.
  if (endX > viewportWidth) {
    // The x coordinate is set to 5 pixels to the left of the right of the viewport to avoid the mouseup event not firing.
    endX = viewportWidth - 5;
  }

  // The element is being dragged past the left of the viewport.
  if (endX < 0) {
    // The x coordinate is set to 5 pixels to the right of the left of the viewport to avoid the mouseup event not firing.
    endX = 5;
  }

  return endX;
};

const calculateEndY = (startY: number, dragByY: number, viewportHeight: number) => {
  let endY = startY + dragByY;
  // The element is being dragged past the bottom of the viewport.
  if (endY > viewportHeight) {
    // The y coordinate is set to 5 pixels above the bottom of the viewport to avoid the mouseup event not firing.
    endY = viewportHeight - 5;
  }

  // The element is being dragged past the top of the viewport.
  if (endY < 0) {
    // The y coordinate is set to 5 pixels below the top of the viewport to avoid the mouseup event not firing.
    endY = 5;
  }

  return endY;
};

const moveElement = async (page: E2EPage, startX: number, startY: number, dragByX = 0, dragByY = 0) => {
  const steps = 10;
  const browser = page.context().browser()!.browserType().name();

  const viewport = page.viewportSize();
  if (viewport === null) {
    throw new Error(
      'Cannot get viewport size. See https://playwright.dev/docs/api/class-page#page-viewport-size for more information'
    );
  }

  const endX = calculateEndX(startX, dragByX, viewport.width);
  const endY = calculateEndY(startY, dragByY, viewport.height);

  // Drag the element.
  for (let i = 1; i <= steps; i++) {
    const middleX = startX + (endX - startX) * (i / steps);
    const middleY = startY + (endY - startY) * (i / steps);

    await page.mouse.move(middleX, middleY);

    // Safari needs to wait for a repaint to occur before moving the mouse again.
    if (browser === 'webkit' && i % 2 === 0) {
      // Repainting every 2 steps is enough to keep the drag gesture smooth.
      // Anything past 4 steps will cause the drag gesture to be flaky.
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
  }
};
