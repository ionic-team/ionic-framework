import { newE2EPage } from '@stencil/core/testing';

test('tab-bar: scenarios', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/scenarios'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
