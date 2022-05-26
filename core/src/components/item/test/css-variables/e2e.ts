import { newE2EPage } from '@stencil/core/testing';

test('item: CSS variables', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/css-variables?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
