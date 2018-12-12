import { newE2EPage } from '@stencil/core/testing';

test('item: buttons', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/buttons?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
