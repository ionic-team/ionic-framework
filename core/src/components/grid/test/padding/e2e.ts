import { newE2EPage } from '@stencil/core/testing';

it('grid: padding', async () => {
  const page = await newE2EPage({
    url: '/src/components/grid/test/padding?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
