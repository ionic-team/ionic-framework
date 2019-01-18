import { newE2EPage } from '@stencil/core/testing';

test('searchbar: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/basic?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('searchbar: basic');
  expect(compare).toMatchScreenshot();

  const searchbar = await page.find('ion-searchbar');
  await searchbar.callMethod('setFocus');
  expect(await page.compareScreenshot('searchbar: basic-focused')).toMatchScreenshot();
});

test('searchbar: basic-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/basic?ionic:_testing=true&rtl=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('searchbar: basic-rtl');
  expect(compare).toMatchScreenshot();

  const searchbar = await page.find('ion-searchbar');
  await searchbar.callMethod('setFocus');
  expect(await page.compareScreenshot('searchbar: basic-rtl-focused')).toMatchScreenshot();
});
