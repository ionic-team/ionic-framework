import { getPartsFromCalendarDay, parseAmPm } from '../utils/parse';

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

describe('parseAmPm()', () => {
  it('should return pm when the hour is greater than or equal to 12', () => {
    expect(parseAmPm(12)).toEqual('pm');
    expect(parseAmPm(13)).toEqual('pm');
  });

  it('should return am when the hour is less than 12', () => {
    expect(parseAmPm(11)).toEqual('am');
  });
});
