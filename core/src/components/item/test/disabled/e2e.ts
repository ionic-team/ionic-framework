import { newE2EPage } from '@stencil/core/testing';

test('item: disabled', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/disabled?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('item: disabled-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/disabled?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
