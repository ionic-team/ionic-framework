import { newE2EPage } from '@stencil/core/testing';

test('tab-bar: scenarios', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/scenarios?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('tab-bar:rtl: scenarios', async () => {
  const page = await newE2EPage({
    url: '/src/components/tab-bar/test/scenarios?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
