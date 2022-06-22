import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';
import { scrollToBottom } from '@utils/test';

/**
 * This test suite verifies that the fade effect for iOS is working correctly
 * when the `ion-footer` is using a custom scroll target with the `.ion-content-scroll-host`
 * selector.
 */
describe('footer: fade with custom scroll target: iOS', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/footer/test/scroll-target?ionic:_testing=true&ionic:mode=ios',
    });
  });

  it('should match existing visual screenshots', async () => {
    const compares = [];

    compares.push(await page.compareScreenshot('footer: blurred'));

    await scrollToBottom(page, '#scroll-target');

    compares.push(await page.compareScreenshot('footer: not blurred'));

    for (const compare of compares) {
      expect(compare).toMatchScreenshot();
    }
  });
});
