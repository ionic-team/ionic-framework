import { newE2EPage } from '@stencil/core/testing';

test('searchbar: toolbar', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/toolbar?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('searchbar: toolbar');
  expect(compare).toMatchScreenshot();
});

test('searchbar: toolbar-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/toolbar?ionic:_testing=true&rtl=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('searchbar: toolbar-rtl');
  expect(compare).toMatchScreenshot();
});
