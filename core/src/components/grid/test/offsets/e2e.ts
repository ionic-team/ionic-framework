import { newE2EPage } from '@stencil/core/testing';

it('grid: offsets', async () => {
  const page = await newE2EPage({
    url: '/src/components/grid/test/offsets?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
