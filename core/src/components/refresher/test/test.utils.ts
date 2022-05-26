import type { E2EPage } from '@utils/test/playwright';

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
  const target = page.locator(selector);

  await page.waitForSelector('ion-refresher.hydrated', { state: 'attached' });

  const ev = await page.spyOnEvent('ionRefreshComplete');
  const boundingBox = await target.boundingBox();

  if (!boundingBox) {
    return;
  }

  const startX = boundingBox.x + boundingBox.width / 2;
  const startY = boundingBox.y + boundingBox.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();

  for (let i = 0; i < 400; i += 20) {
    await page.mouse.move(startX, startY + i);
  }

  await page.mouse.up();
  await ev.next();
};

export { pullToRefresh };
