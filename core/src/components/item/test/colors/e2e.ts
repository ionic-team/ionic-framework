import { newE2EPage } from '@stencil/core/testing';

test('item: colors', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/colors?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
