import { newE2EPage } from '@stencil/core/testing';
import type { E2EPage } from '@stencil/core/testing';

/**
 * Scrolls an `ion-content` element to the bottom, triggering the `ionInfinite` event.
 * Waits for the custom event to complete.
 */
const scrollIonContentPage = async (page: E2EPage) => {
  const content = await page.find('ion-content');
  await content.callMethod('scrollToBottom');
  await page.waitForChanges();

  const ev = await page.spyOnEvent('ionInfiniteComplete', 'document');
  await ev.next();
};

describe('infinite-scroll: basic', () => {
  it('should match existing visual screenshots', async () => {
    const page = await newE2EPage({
      url: '/src/components/infinite-scroll/test/basic?ionic:_testing=true',
    });

    const compare = await page.compareScreenshot();
    expect(compare).toMatchScreenshot();
  });

  describe('when enabled', () => {
    it('should load more items when scrolled to the bottom', async () => {
      const page = await newE2EPage({
        url: '/src/components/infinite-scroll/test/basic?ionic:_testing=true',
      });

      const initialItems = await page.findAll('ion-item');

      expect(initialItems.length).toBe(30);

      await scrollIonContentPage(page);

      const updatedItems = await page.findAll('ion-item');

      expect(updatedItems.length).toBe(60);
    });
  });
});
