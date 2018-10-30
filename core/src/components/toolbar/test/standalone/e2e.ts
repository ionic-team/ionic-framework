import { newE2EPage } from '@stencil/core/testing';

test('toolbar: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
