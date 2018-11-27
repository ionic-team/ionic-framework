import { newE2EPage } from '@stencil/core/testing';

test('item-sliding: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
