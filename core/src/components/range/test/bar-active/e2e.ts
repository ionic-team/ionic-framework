import { newE2EPage } from '@stencil/core/testing';

test('range: bar-active', async () => {
  const page = await newE2EPage({
    url: '/src/components/range/test/bar-active?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});