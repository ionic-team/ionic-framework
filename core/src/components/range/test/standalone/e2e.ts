import { newE2EPage } from '@stencil/core/testing';

test('range: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/range/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
