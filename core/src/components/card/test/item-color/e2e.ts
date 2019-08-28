import { newE2EPage } from '@stencil/core/testing';

test('card: item-color', async () => {
  const page = await newE2EPage({
    url: '/src/components/card/test/item-color?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
