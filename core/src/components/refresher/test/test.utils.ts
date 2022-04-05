import type { E2EPage } from '@stencil/core/testing';
import { dragElementBy } from '@utils/test';

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
  const target = (await page.$(selector))!;

  await dragElementBy(target, page, 0, 200);
  const ev = await page.spyOnEvent('ionRefreshComplete', 'document');
  await ev.next();
};

export { pullToRefresh };
