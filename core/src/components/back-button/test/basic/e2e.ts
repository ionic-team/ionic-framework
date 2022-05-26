import { newE2EPage } from '@stencil/core/testing';

test('back-button: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/back-button/test/basic?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('back-button: basic-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/back-button/test/basic?ionic:_testing=true&rtl=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
