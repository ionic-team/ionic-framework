import { newE2EPage } from '@stencil/core/testing';

test('tab: placements', async () => {
  const page = await newE2EPage({
    url: '/src/components/tabs/test/placements'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
