import { newE2EPage } from '@stencil/core/testing';

test('radio-group: search', async () => {
  const page = await newE2EPage({
    url: '/src/components/radio-group/test/search?ionic:_testing=true'
  });

  const screenshotCompares = [];
  screenshotCompares.push(await page.compareScreenshot());

  const radioTwo = await page.find('ion-radio[value=two]');
  await radioTwo.click();

  const value = await page.find('#value');
  expect(value.textContent).toEqual('Current value: two');

  const searchbar = await page.find('ion-searchbar');
  await searchbar.click();
  await page.keyboard.type('zero');

  const valueAgain = await page.find('#value');
  expect(valueAgain.textContent).toEqual('Current value: two');

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
