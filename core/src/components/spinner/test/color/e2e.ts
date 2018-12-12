import { newE2EPage } from '@stencil/core/testing';

test('spinner: color', async () => {
  const page = await newE2EPage({
    url: '/src/components/spinner/test/color'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
