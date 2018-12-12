import { newE2EPage } from '@stencil/core/testing';

test('item-sliding: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/basic'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
