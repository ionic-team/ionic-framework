import { newE2EPage } from '@stencil/core/testing';

test('item-divider: spec', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-divider/test/spec?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('item-divider: spec-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/item-divider/test/spec?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
