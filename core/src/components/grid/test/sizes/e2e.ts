import { newE2EPage } from '@stencil/core/testing';

test('grid: sizes', async () => {
  const page = await newE2EPage({
    url: '/src/components/grid/test/sizes'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
