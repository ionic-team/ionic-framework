import { newE2EPage } from '@stencil/core/testing';

test('tab-bar: preview', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/preview?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot('tab-bar: preview');
  expect(compare).toMatchScreenshot();
});

test('tab-bar: preview-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/preview?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot('tab-bar: preview-rtl');
  expect(compare).toMatchScreenshot();
});
