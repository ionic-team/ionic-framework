import { newE2EPage } from '@stencil/core/testing';

test('progress-bar: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/progress-bar/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot('progress-bar: basic');
  expect(compare).toMatchScreenshot();
});

test('progress-bar: basic-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/progress-bar/test/basic?ionic:_testing=true&rtl=true'
  });

  const compare = await page.compareScreenshot('progress-bar: basic-rtl');
  expect(compare).toMatchScreenshot();
});
