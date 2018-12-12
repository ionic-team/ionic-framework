import { newE2EPage } from '@stencil/core/testing';

test('spinner: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/spinner/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
