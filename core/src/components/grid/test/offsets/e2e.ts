import { newE2EPage } from '@stencil/core/testing';

test('grid: offsets', async () => {
  const page = await newE2EPage({
    url: '/src/components/grid/test/offsets?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
