import { newE2EPage } from '@stencil/core/testing';

test('range: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/range/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
