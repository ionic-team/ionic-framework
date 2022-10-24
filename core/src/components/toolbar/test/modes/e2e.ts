import { newE2EPage } from '@stencil/core/testing';

test('toolbar: modes', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/modes?ionic:_testing=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});

test('toolbar:rtl: modes', async () => {
  const page = await newE2EPage({
    url: '/src/components/toolbar/test/modes?ionic:_testing=true&rtl=true',
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
