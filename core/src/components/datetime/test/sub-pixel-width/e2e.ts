import { newE2EPage } from '@stencil/core/testing';

describe('datetime: sub-pixel width', () => {

  test('should update the month when next button is clicked', async () => {
    const page = await newE2EPage({
      url: '/src/components/datetime/test/sub-pixel-width?ionic:_testing=true'
    });

    const openModalBtn = await page.find('#open-modal');

    await openModalBtn.click();

    const modal = await page.find('ion-modal');
    await modal.waitForVisible();
    await page.waitForTimeout(250);

    const buttons = await page.findAll('ion-datetime >>> .calendar-next-prev ion-button')

    await buttons[1].click();

    await page.waitForEvent('datetimeCalendarMonthSpecTestEvent');

    const monthYear = await page.find('ion-datetime >>> .calendar-month-year');

    expect(monthYear.textContent.trim()).toBe('March 2022');
  });

  test('should update the month when prev button is clicked', async () => {
    const page = await newE2EPage({
      url: '/src/components/datetime/test/sub-pixel-width?ionic:_testing=true'
    });

    const openModalBtn = await page.find('#open-modal');

    await openModalBtn.click();

    const modal = await page.find('ion-modal');
    await modal.waitForVisible();
    await page.waitForTimeout(250);

    const buttons = await page.findAll('ion-datetime >>> .calendar-next-prev ion-button')

    await buttons[0].click();

    await page.waitForEvent('datetimeCalendarMonthSpecTestEvent');

    const monthYear = await page.find('ion-datetime >>> .calendar-month-year');

    expect(monthYear.textContent.trim()).toBe('January 2022');
  });

});
