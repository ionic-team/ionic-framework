import { newE2EPage } from '@stencil/core/testing';

test('segment: colors', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/colors?ionic:_testing=true'
  });

  await page.waitForTimeout(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('segment:rtl: colors', async () => {
  const page = await newE2EPage({
    url: '/src/components/segment/test/colors?ionic:_testing=true&rtl=true'
  });

  await page.waitForTimeout(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
