import { newE2EPage } from '@stencil/core/testing';

test('minmax', async () => {
  const page = await newE2EPage({
    url: '/src/components/datetime/test/minmax?ionic:_testing=true'
  });

  const screenshotCompares = [];

  screenshotCompares.push(await page.compareScreenshot());

  const monthYearItem = await page.find('ion-datetime#inside >>> .calendar-month-year');

  await monthYearItem.click();
  await page.waitForChanges();

  screenshotCompares.push(await page.compareScreenshot());

  for (const screenshotCompare of screenshotCompares) {
    expect(screenshotCompare).toMatchScreenshot();
  }
});
