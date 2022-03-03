import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

import { scrollToBottom } from '@utils/test';

/**
 * This test suite verifies that the fade effect for iOS is working correctly
 * when the `ion-footer` is using a custom scroll target with the `.ion-content-scroll-host`
 * selector.
 */
describe('footer: fade with custom scroll target', () => {

  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/footer/test/scroll-target?ionic:_testing=true&ionic:mode=ios'
    });
  });

  it('should match existing iOS visual screenshots', async () => {
    const compare = await page.compareScreenshot();
    expect(compare).toMatchScreenshot();
  });

  it('should update the opacity scale when scrolling', async () => {
    const footer = await page.$('ion-footer');

    let opacityScale;

    opacityScale = await footer.evaluate((el: any) => el.style.getPropertyValue('--opacity-scale'));
    expect(opacityScale).toBe('1');

    await scrollToBottom(page, '#scroll-target');
    await page.waitForChanges();

    opacityScale = await footer.evaluate((el: any) => el.style.getPropertyValue('--opacity-scale'));
    expect(opacityScale).toBe('0');
  });

});
