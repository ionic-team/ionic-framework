import { newE2EPage } from '@stencil/core/testing';

test('toggle: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/standalone?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot('toggle: standalone');
  expect(compare).toMatchScreenshot();
});

test('toggle: standalone-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/standalone?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot('toggle: standalone-rtl');
  expect(compare).toMatchScreenshot();
});
