import { newE2EPage } from '@stencil/core/testing';

test('toggle: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/basic?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('toggle: basic');
  expect(compare).toMatchScreenshot();
});

test('toggle: basic-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/toggle/test/basic?ionic:_testing=true&rtl=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('toggle: basic-rtl');
  expect(compare).toMatchScreenshot();
});
