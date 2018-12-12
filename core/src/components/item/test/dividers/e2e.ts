import { newE2EPage } from '@stencil/core/testing';

test('item: dividers', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/dividers'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
