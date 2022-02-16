import { newE2EPage } from '@stencil/core/testing';

describe('datetime: position', () => {

  it('should position the time picker relative to the click target', async () => {
    const page = await newE2EPage({
      url: '/src/components/datetime/test/position?ionic:_testing=true'
    });
    const screenshotCompares = [];

    const openDateTimeBtn = await page.find('ion-button');
    await openDateTimeBtn.click();

    screenshotCompares.push(await page.compareScreenshot());

    const timepickerBtn = await page.find('ion-datetime >>> .time-body');
    await timepickerBtn.click();

    screenshotCompares.push(await page.compareScreenshot());

    for (const screenshotCompare of screenshotCompares) {
      expect(screenshotCompare).toMatchScreenshot();
    }

  });

});
