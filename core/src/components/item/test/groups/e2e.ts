import { newE2EPage } from '@stencil/core/testing';

test('item: groups', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/groups'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
