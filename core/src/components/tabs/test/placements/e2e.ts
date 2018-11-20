import { newE2EPage } from '@stencil/core/testing';

test('tab: placements', async () => {
  const page = await newE2EPage({
    url: '/src/components/tabs/test/placements?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
