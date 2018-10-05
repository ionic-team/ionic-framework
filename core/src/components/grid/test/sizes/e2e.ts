import { newE2EPage } from '@stencil/core/testing';

it('grid: sizes', async () => {
  const page = await newE2EPage({
    url: '/src/components/grid/test/sizes?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
