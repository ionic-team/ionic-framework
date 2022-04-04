import { newE2EPage } from '@stencil/core/testing';

test('item: icons', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/icons?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('item: icons-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/item/test/icons?ionic:_testing=true&rtl=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
