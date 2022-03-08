import type { E2EPage } from '@stencil/core/testing';

import { waitForEvent } from '@utils/testing';

/**
 * Emulates a pull-to-refresh drag gesture (pulls down and releases).
 *
 * You will need to manually dispatch an event called `ionRefreshComplete`
 * in your `complete()` handler for the refresh event. Otherwise the `waitForEvent`
 * will complete when the timeout completes (5000ms).
 *
 * @param page The E2E Page object.
 * @param selector The element selector to center the drag gesture on. Defaults to `body`.
 */
const pullToRefresh = async (page: E2EPage, selector = 'body') => {
  const target = await page.$(selector);

  const boundingBox = await target.boundingBox();

  const centerX = boundingBox.x + boundingBox.width / 2;
  const centerY = boundingBox.y + boundingBox.height / 2;

  await page.mouse.move(centerX, centerY);
  await page.mouse.down();

  // The refresher gesture requires a pull threshold of 0.4
  for (let i = 0; i < 20; i++) {
    await page.mouse.move(centerX, centerY + i * 10);
  }

  await page.mouse.up();
  await waitForEvent(page, 'ionRefreshComplete');
}

export { pullToRefresh };
