import { newE2EPage } from '@stencil/core/testing';

it('item: media', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/media?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
