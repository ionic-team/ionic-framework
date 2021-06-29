import { newE2EPage } from '@stencil/core/testing';

test('toggle: sizes', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/sizes?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('toggle:rtl: sizes', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/sizes?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
