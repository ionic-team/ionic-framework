import { E2EPage, newE2EPage } from '@stencil/core/testing';

describe('datetime: setting the value', () => {

  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/datetime/test/set-value?ionic:_testing=true'
    });
  });

  it('should update the active date', async () => {

    await page.$eval('ion-datetime', (elm: any) => {
      elm.value = '2021-11-25T12:40:00.000Z';
    });

    await page.waitForChanges();

    const activeDate = await page.find('ion-datetime >>> .calendar-day-active');

    expect(activeDate).toEqualText('25');
  });

  it('should update the active time', async () => {
    await page.$eval('ion-datetime', (elm: any) => {
      elm.value = '2021-11-25T12:40:00.000Z';
    });

    await page.waitForChanges();

    const activeTime = await page.find('ion-datetime >>> .time-body');

    expect(activeTime).toEqualText('12:40 PM');
  });

  describe('presentation: time', () => {

    it('should update the active time', async () => {
      const screenshotCompares = [];

      screenshotCompares.push(await page.compareScreenshot('time picker initial value'));

      const initialValue = await (await page.find('#timePicker')).getProperty('value');
      expect(initialValue).toEqual('18:25:40');

      await page.click('#timePickerSetValueBtn');
      await page.waitForChanges();

      screenshotCompares.push(await page.compareScreenshot('time picker value set'));

      const updatedValue = await (await page.find('#timePicker')).getProperty('value');
      expect(updatedValue).toEqual('11:02:40');

      for (const screenshotCompare of screenshotCompares) {
        expect(screenshotCompare).toMatchScreenshot();
      }

    });

  });

});
