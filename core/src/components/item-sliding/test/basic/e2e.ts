import { newE2EPage } from '@stencil/core/testing';

test('item-sliding: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('item-sliding:rtl: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-sliding/test/basic?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
