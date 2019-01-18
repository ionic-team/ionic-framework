import { newE2EPage } from '@stencil/core/testing';

test('searchbar: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/standalone?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('searchbar: standalone');
  expect(compare).toMatchScreenshot();

  const searchbar = await page.find('ion-searchbar');
  await searchbar.callMethod('setFocus');
  expect(await page.compareScreenshot('searchbar: standalone-focused')).toMatchScreenshot();
});

test('searchbar: standalone-rtl', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/standalone?ionic:_testing=true&rtl=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot('searchbar: standalone-rtl');
  expect(compare).toMatchScreenshot();

  const searchbar = await page.find('ion-searchbar');
  await searchbar.callMethod('setFocus');
  expect(await page.compareScreenshot('searchbar: standalone-rtl-focused')).toMatchScreenshot();
});
