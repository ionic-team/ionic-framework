import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

describe('datetime: setting the value', () => {
  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/datetime/test/set-value?ionic:_testing=true',
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
});
