import { clampDate, getPartsFromCalendarDay, parseAmPm } from '../utils/parse';

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
  const minParts = {
    year: 2021,
    month: 6,
    day: 5,
  };

  const maxParts = {
    year: 2021,
    month: 8,
    day: 19,
  };
  it('should return the max month when the value is greater than the max', () => {
    const dateParts = {
      year: 2022,
      month: 5,
      day: 24,
    };
    const value = clampDate(dateParts, minParts, maxParts);
    expect(value).toStrictEqual(maxParts);
  });

  it('should return the min month when the value is less than the min', () => {
    const dateParts = {
      year: 2020,
      month: 5,
      day: 24,
    };
    const value = clampDate(dateParts, minParts, maxParts);
    expect(value).toStrictEqual(minParts);
  });

  it('should return the value when the value is greater than the min and less than the max', () => {
    const dateParts = {
      year: 2021,
      month: 7,
      day: 10,
    };
    const value = clampDate(dateParts, minParts, maxParts);
    expect(value).toStrictEqual(dateParts);
  });
});

describe('parseAmPm()', () => {
  it('should return pm when the hour is greater than or equal to 12', () => {
    expect(parseAmPm(12)).toEqual('pm');
    expect(parseAmPm(13)).toEqual('pm');
  });

  it('should return am when the hour is less than 12', () => {
    expect(parseAmPm(11)).toEqual('am');
  });
});
