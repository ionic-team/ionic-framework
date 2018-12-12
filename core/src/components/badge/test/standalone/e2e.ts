import { newE2EPage } from '@stencil/core/testing';

test('badge: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/badge/test/standalone'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
