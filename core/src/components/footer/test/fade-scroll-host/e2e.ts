import { newE2EPage } from '@stencil/core/testing';

/**
 * This test suite verifies that the fade effect for iOS is working correctly
 * when the `ion-footer` is using a custom scroll target with the `.ion-content-scroll-host`
 * selector.
 */
describe('footer: fade with custom scroll host', () => {

  it('should match existing iOS visual screenshots', async () => {
    const page = await newE2EPage({
      url: '/src/components/footer/test/fade-scroll-host?ionic:_testing=true&ionic:mode=ios'
    });

    const compare = await page.compareScreenshot();
    expect(compare).toMatchScreenshot();
  });

});
