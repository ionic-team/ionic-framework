import { newE2EPage } from '@stencil/core/testing';

test('spinner: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/spinner/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
