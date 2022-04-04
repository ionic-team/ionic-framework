import { newE2EPage } from '@stencil/core/testing';
import type { E2EPage } from '@stencil/core/testing';
import { scrollToBottom } from '@utils/test';

/**
 * Scrolls an `ion-content` element to the bottom, triggering the `ionInfinite` event.
 * Waits for the custom event to complete.
 */
async function scrollPage(page: E2EPage) {
  await scrollToBottom(page, '#scroll-target');
  await page.waitForChanges();

  const ev = await page.spyOnEvent('ionInfiniteComplete', 'document');
  await ev.next();
}

describe('infinite-scroll: custom scroll target', () => {
  it('should load more items when scrolled to the bottom', async () => {
    const page = await newE2EPage({
      url: '/src/components/infinite-scroll/test/scroll-target?ionic:_testing=true',
    });

    const initialItems = await page.findAll('ion-item');
    expect(initialItems.length).toBe(30);

    await scrollPage(page);

    const items = await page.findAll('ion-item');

    expect(items.length).toBe(60);
  });
});
