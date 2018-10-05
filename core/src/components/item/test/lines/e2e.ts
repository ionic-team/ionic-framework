import { newE2EPage } from '@stencil/core/testing';

it('item: lines', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/lines?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
