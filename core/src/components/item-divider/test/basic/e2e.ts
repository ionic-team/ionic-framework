import { newE2EPage } from '@stencil/core/testing';

test('item-divider: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-divider/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
