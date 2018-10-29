import { newE2EPage } from '@stencil/core/testing';

test('item: groups', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/groups?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
