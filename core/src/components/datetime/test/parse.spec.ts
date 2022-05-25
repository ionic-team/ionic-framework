import { clampDate, getPartsFromCalendarDay } from '../utils/parse';

describe('getPartsFromCalendarDay()', () => {
  it('should extract DatetimeParts from a calendar day element', () => {
    const div = document.createElement('div');
    div.setAttribute('data-month', '4');
    div.setAttribute('data-day', '15');
    div.setAttribute('data-year', '2010');
    div.setAttribute('data-day-of-week', '5');

    expect(getPartsFromCalendarDay(div)).toEqual({
      day: 15,
      month: 4,
      year: 2010,
      dayOfWeek: 5,
    });
  });
});

// TODO: parseDate()

describe('clampDate()', () => {
  it('should return the max month when the value is greater than the max', () => {
    const value = clampDate('2022-05-24', '2021-06-05', '2021-08-19');
    expect(value).toEqual('2021-08-19');
  });

  it('should return the min month when the value is less than the min', () => {
    const value = clampDate('2020-05-24', '2021-06-05', '2021-08-19');
    expect(value).toEqual('2021-06-05');
  });

  it('should return the value when the value is greater than the min and less than the max', () => {
    const value = clampDate('2021-07-10', '2021-06-05', '2021-08-19');
    expect(value).toEqual('2021-07-10');
  });
});
