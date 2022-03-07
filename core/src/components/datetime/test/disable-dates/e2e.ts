import type { E2EPage } from '@stencil/core/testing';
import { newE2EPage } from '@stencil/core/testing';

describe('datetime: disable dates', () => {

  let page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage({
      url: '/src/components/datetime/test/disable-dates?ionic:_testing=true'
    });
  });

  it('should disable a specific date', async () => {
    const disabledDay = await page.find('#specificDate >>> .calendar-day[disabled]:not(.calendar-day-padding)');

    expect(disabledDay.textContent).toBe('10');
  });

  it('should disable specific days of the week', async () => {
    const disabledDays = await page.findAll('#weekends >>> .calendar-month:nth-child(2) .calendar-day[disabled]:not(.calendar-day-padding)');
    const disabledValues = disabledDays.map(d => d.textContent);

    expect(disabledValues).toEqual(['2', '3', '9', '10', '16', '17', '23', '24', '30', '31']);
  });

  it('should disable a range of dates', async () => {
    const disabledDays = await page.findAll('#dateRange >>> .calendar-day[disabled]:not(.calendar-day-padding)');
    const disabledValues = disabledDays.map(d => d.textContent);

    expect(disabledValues).toEqual(['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']);
  });

  it('should disable a month', async () => {
    const disabledDays = await page.findAll('#month >>> .calendar-day[disabled]:not(.calendar-day-padding)');
    const disabledValues = disabledDays.map(d => d.textContent);

    expect(disabledValues.length).toBe(31);
  });

});
