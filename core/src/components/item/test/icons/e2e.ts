import { newE2EPage } from '@stencil/core/testing';

test('item: icons', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/icons'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
