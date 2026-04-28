/**
 * The drag gesture will not operate as expected when the element is dragged outside of the viewport because the Mouse class does not fire events outside of the viewport.
 *
 * For example, if the mouse is moved outside of the viewport, then the `mouseup` event will not fire.
 *
 * See https://playwright.dev/docs/api/class-mouse#mouse-move for more information.
 */

import type { ElementHandle, Locator } from '@playwright/test';

import type { E2EPage } from './';

/**
 * Drags an element by the given number of pixels on the X and Y axes.
 *
 * @param el The element to drag.
 * @param page The E2E Page object.
 * @param dragByX The number of pixels to drag on the X axis. Negative values drag left, positive values drag right.
 * @param dragByY The number of pixels to drag on the Y axis. Negative values drag up, positive values drag down.
 * @param startXCoord The X coordinate to start the drag from. Defaults to the center of the element.
 * @param startYCoord The Y coordinate to start the drag from. Defaults to the center of the element.
 * @param releaseDrag Whether to release the drag at the end of the gesture. Defaults to `true`.
 * @param steps The number of steps to divide the drag into. More steps reduce velocity; fewer steps increase it. Use this to control whether velocity-based thresholds (e.g. full-swipe) are triggered, particularly in Safari where gesture velocity is calculated relative to animation frames. Defaults to `10`.
 */
export const dragElementBy = async (
  el: Locator | ElementHandle<SVGElement | HTMLElement>,
  page: E2EPage,
  dragByX = 0,
  dragByY = 0,
  startXCoord?: number,
  startYCoord?: number,
  releaseDrag = true,
  steps?: number
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
  await moveElement(page, startX, startY, dragByX, dragByY, steps);

  if (releaseDrag) {
    await page.mouse.up();
  }
};

/**
 * Drags an element by the given amount of pixels on the Y axis.
 *
 * @param el The element to drag.
 * @param page The E2E Page object.
 * @param dragByY The number of pixels to drag on the Y axis.
 * @param startYCoord The Y coordinate to start the drag from. Defaults to the center of the element.
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

const validateDragByX = (startX: number, dragByX: number, viewportWidth: number) => {
  const endX = startX + dragByX;
  // The element is being dragged past the right of the viewport.
  if (endX > viewportWidth) {
    const recommendedDragByX = viewportWidth - startX - 5;
    throw new Error(
      `The element is being dragged past the right of the viewport. Update the dragByX value to prevent going out of bounds. A recommended value is ${recommendedDragByX}.`
    );
  }

  // The element is being dragged past the left of the viewport.
  if (endX < 0) {
    const recommendedDragByX = startX - 5;
    throw new Error(
      `The element is being dragged past the left of the viewport. Update the dragByX value to prevent going out of bounds. A recommended value is ${recommendedDragByX}.`
    );
  }
};

const validateDragByY = (startY: number, dragByY: number, viewportHeight: number) => {
  const endY = startY + dragByY;
  // The element is being dragged past the bottom of the viewport.
  if (endY > viewportHeight) {
    const recommendedDragByY = viewportHeight - startY - 5;
    throw new Error(
      `The element is being dragged past the bottom of the viewport. Update the dragByY value to prevent going out of bounds. A recommended value is ${recommendedDragByY}.`
    );
  }

  // The element is being dragged past the top of the viewport.
  if (endY < 0) {
    const recommendedDragByY = startY - 5;
    throw new Error(
      `The element is being dragged past the top of the viewport. Update the dragByY value to prevent going out of bounds. A recommended value is ${recommendedDragByY}.`
    );
  }
};

const moveElement = async (page: E2EPage, startX: number, startY: number, dragByX = 0, dragByY = 0, steps = 10) => {
  const browser = page.context().browser()!.browserType().name();

  const viewport = page.viewportSize();
  if (viewport === null) {
    throw new Error(
      'Cannot get viewport size. See https://playwright.dev/docs/api/class-page#page-viewport-size for more information'
    );
  }

  validateDragByX(startX, dragByX, viewport.width);
  validateDragByY(startY, dragByY, viewport.height);

  const endX = startX + dragByX;
  const endY = startY + dragByY;

  // Drag the element.
  for (let i = 1; i <= steps; i++) {
    const middleX = startX + (endX - startX) * (i / steps);
    const middleY = startY + (endY - startY) * (i / steps);

    await page.mouse.move(middleX, middleY);

    /**
     * In Safari, gesture velocity is calculated relative to animation frames.
     * Without waiting for a repaint, consecutive `mouse.move` events arrive
     * with ~0ms time delta and velocity never accumulates, causing gesture
     * detection to fail.
     */
    if (browser === 'webkit' && i % 2 === 0) {
      /**
       * Repainting every 2 steps is enough to keep the drag gesture smooth.
       * Repainting on every step makes the test slow, and repainting every
       * 4+ steps means Safari does not see enough frames to track the gesture
       * reliably.
       */
      await page.evaluate(() => new Promise(requestAnimationFrame));
    }
  }
};
