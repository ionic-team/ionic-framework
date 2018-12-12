import { newE2EPage } from '@stencil/core/testing';

test('grid: padding', async () => {
  const page = await newE2EPage({
    url: '/src/components/grid/test/padding'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
