import { newE2EPage } from '@stencil/core/testing';

test('searchbar: standalone', async () => {
  const page = await newE2EPage({
    url: '/src/components/searchbar/test/standalone?ionic:_testing=true'
  });

  await page.waitFor(250);

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();

  const searchbar = await page.find('ion-searchbar');
  await searchbar.callMethod('setFocus');
  expect(await page.compareScreenshot('focused')).toMatchScreenshot();
});
