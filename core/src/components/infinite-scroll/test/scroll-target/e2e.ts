import { newE2EPage } from '@stencil/core/testing';
import type { E2EPage } from '@stencil/core/testing';

import { scrollToBottom, waitForEvent } from '@utils/test';

/**
 * Scrolls an `ion-content` element to the bottom, triggering the `ionInfinite` event.
 * Waits for the custom event to complete.
 */
async function scrollPage(page: E2EPage) {
  await scrollToBottom(page, '#scroll-target');
  await page.waitForChanges();
  await waitForEvent(page, 'ionInfiniteComplete');
}

describe('infinite-scroll: custom scroll target', () => {

  it('should load more items when scrolled to the bottom', async () => {
    const page = await newE2EPage({
      url: '/src/components/infinite-scroll/test/scroll-target?ionic:_testing=true'
    });

    await scrollPage(page);

    const items = await page.findAll('ion-item');

    expect(items.length).toBe(60);
  });

});
