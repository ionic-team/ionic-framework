import { newE2EPage } from '@stencil/core/testing';

test('item: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('item: basic-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/basic?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
