import { newE2EPage } from '@stencil/core/testing';
import type { E2EPage } from '@stencil/core/testing';

import { waitForEvent } from '@utils/test';

/**
 * Scrolls an `ion-content` element to the bottom, triggering the `ionInfinite` event.
 * Waits for the custom event to complete.
 */
async function scrollIonContentPage(page: E2EPage) {
  const content = await page.find('ion-content');
  await content.callMethod('scrollToBottom');
  await page.waitForChanges();
  await waitForEvent(page, 'ionInfiniteComplete');
}

describe('infinite-scroll: basic', () => {

  it('should match existing visual screenshots', async () => {
    const page = await newE2EPage({
      url: '/src/components/infinite-scroll/test/basic?ionic:_testing=true'
    });

    const compare = await page.compareScreenshot();
    expect(compare).toMatchScreenshot();
  });

  describe('when enabled', () => {

    it('should load more items when scrolled to the bottom', async () => {
      const page = await newE2EPage({
        url: '/src/components/infinite-scroll/test/basic?ionic:_testing=true'
      });

      await scrollIonContentPage(page);

      const items = await page.findAll('ion-item');

      expect(items.length).toBe(60);
    });

  });


});
