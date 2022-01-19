import { newE2EPage } from '@stencil/core/testing';

test('item: counter', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/counter?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('item: counter-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/counter?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
