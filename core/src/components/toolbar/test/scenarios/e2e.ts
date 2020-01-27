import { newE2EPage } from '@stencil/core/testing';

test('toolbar: scenarios', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/scenarios?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('toolbar:rtl: scenarios', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/scenarios?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
