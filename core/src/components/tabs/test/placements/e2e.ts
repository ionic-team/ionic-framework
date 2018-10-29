import { newE2EPage } from '@stencil/core/testing';

test('tab-group: placements', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-group/test/placements?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
