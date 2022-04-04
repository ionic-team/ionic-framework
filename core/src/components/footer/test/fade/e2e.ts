import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';
import { scrollToBottom } from '@utils/test';

describe('footer: fade: iOS', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/footer/test/fade?ionic:_testing=true&ionic:mode=ios',
    });
  });

  it('should match existing visual screenshots', async () => {
    const compares = [];

    compares.push(await page.compareScreenshot('footer: blurred'));

    await scrollToBottom(page, 'ion-content');

    compares.push(await page.compareScreenshot('footer: not blurred'));

    for (const compare of compares) {
      expect(compare).toMatchScreenshot();
    }
  });
});
