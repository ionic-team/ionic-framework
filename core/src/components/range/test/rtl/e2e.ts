import { newE2EPage } from '@stencil/core/testing';

test('range: RTL', async () => {
  const page = await newE2EPage({
    url: '/src/components/range/test/rtl?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
