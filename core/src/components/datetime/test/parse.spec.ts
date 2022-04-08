import { getPartsFromCalendarDay, parseDate } from '../utils/parse';

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

describe('parseDate()', () => {
  it('should correctly parse a valid ISO 8601 string', () => {
    expect(parseDate('2022-01-01T00:00:00-00:00')).toEqual({
      year: 2022,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: undefined,
      tzOffset: -0,
      ampm: 'am'
    });
  });
  it('should correctly parse a custom timezone offset', () => {
    expect(parseDate('2022-01-01T00:00:00-04:00')).toEqual({
      year: 2022,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: undefined,
      tzOffset: -240,
      ampm: 'am'
    });
  });
  it('should correctly determine AM/PM', () => {
    expect(parseDate('2022-01-01T03:00:00').ampm).toEqual('am');
    expect(parseDate('2022-01-01T13:00:00').ampm).toEqual('pm');
  });
});
