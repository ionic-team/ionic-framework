import { newE2EPage } from '@stencil/core/testing';

test('grid: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/grid/test/basic?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
