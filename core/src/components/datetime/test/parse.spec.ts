import {
  clampDate,
  getPartsFromCalendarDay,
  parseAmPm,
  parseDate,
  parseDateInput,
  parseMinParts,
  parseMaxParts,
} from '../utils/parse';

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
  it('should return undefined when passed undefined', () => {
    expect(parseDate(undefined)).toStrictEqual(undefined);
  });

  it('should return undefined when passed null', () => {
    expect(parseDate(null)).toStrictEqual(undefined);
  });

  it('should return the correct date object when passed a date', () => {
    expect(parseDate('2022-12-15T13:47')).toEqual({
      ampm: 'pm',
      day: 15,
      hour: 13,
      minute: 47,
      month: 12,
      year: 2022,
    });
  });

  /**
   * Note: As Ionic v7 datetime no longer parses time zone information/
   * See https://github.com/ionic-team/ionic-framework/commit/3fb4caf21ffac12f765c4c80bf1850e05d211c6a
   */
  it('should return the correct time zone offset', () => {
    // Casting as any since `tzOffset` does not exist on DatetimeParts
    expect((parseDate('2022-12-15T13:47:30-02:00') as any)?.tzOffset).toEqual(undefined);
  });

  it('should parse an array of dates', () => {
    expect(parseDate(['2022-12-15T13:47', '2023-03-23T20:19:33.517Z'])).toEqual([
      {
        ampm: 'pm',
        day: 15,
        hour: 13,
        minute: 47,
        month: 12,
        year: 2022,
      },
      {
        ampm: 'pm',
        day: 23,
        hour: 20,
        minute: 19,
        month: 3,
        year: 2023,
      },
    ]);
  });
});

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

describe('parseMinParts()', () => {
  it('should fill in missing information when not provided', () => {
    const today = {
      day: 14,
      month: 3,
      year: 2022,
      minute: 4,
      hour: 2,
    };
    expect(parseMinParts('2012', today)).toEqual({
      month: 1,
      day: 1,
      year: 2012,
      hour: 0,
      minute: 0,
    });
  });
  it('should default to current year when only given HH:mm', () => {
    const today = {
      day: 14,
      month: 3,
      year: 2022,
      minute: 4,
      hour: 2,
    };
    expect(parseMinParts('04:30', today)).toEqual({
      month: 1,
      day: 1,
      year: 2022,
      hour: 4,
      minute: 30,
    });
  });
  it('should return undefined when given invalid info', () => {
    const today = {
      day: 14,
      month: 3,
      year: 2022,
      minute: 4,
      hour: 2,
    };
    expect(parseMinParts(undefined as any, today)).toEqual(undefined);
    expect(parseMinParts(null as any, today)).toEqual(undefined);
    expect(parseMinParts('foo', today)).toEqual(undefined);
  });
});

describe('parseMaxParts()', () => {
  it('should fill in missing information when not provided', () => {
    const today = {
      day: 14,
      month: 3,
      year: 2022,
      minute: 4,
      hour: 2,
    };
    expect(parseMaxParts('2012', today)).toEqual({
      month: 12,
      day: 31,
      year: 2012,
      hour: 23,
      minute: 59,
    });
  });
  it('should default to current year when only given HH:mm', () => {
    const today = {
      day: 14,
      month: 3,
      year: 2022,
      minute: 4,
      hour: 2,
    };
    expect(parseMaxParts('04:30', today)).toEqual({
      month: 12,
      day: 31,
      year: 2022,
      hour: 4,
      minute: 30,
    });
  });
  it('should fill in correct day during a leap year', () => {
    const today = {
      day: 14,
      month: 3,
      year: 2022,
      minute: 4,
      hour: 2,
    };
    expect(parseMaxParts('2012-02', today)).toEqual({
      month: 2,
      day: 29,
      year: 2012,
      hour: 23,
      minute: 59,
    });
  });
  it('should return undefined when given invalid info', () => {
    const today = {
      day: 14,
      month: 3,
      year: 2022,
      minute: 4,
      hour: 2,
    };
    expect(parseMaxParts(undefined as any, today)).toEqual(undefined);
    expect(parseMaxParts(null as any, today)).toEqual(undefined);
    expect(parseMaxParts('foo', today)).toEqual(undefined);
  });
});

describe('parseDateInput()', () => {
  it('should parse a date in the locale order', () => {
    expect(parseDateInput('en-US', '06/03/2022')).toEqual({ month: 6, day: 3, year: 2022 });
    expect(parseDateInput('de-DE', '03.06.2022')).toEqual({ month: 6, day: 3, year: 2022 });
    expect(parseDateInput('fr-CA', '2022-06-03')).toEqual({ month: 6, day: 3, year: 2022 });
  });

  it('should accept a missing trailing separator', () => {
    // The mask never adds ko-KR's final ".".
    expect(parseDateInput('ko-KR', '2022. 06. 03')).toEqual({ month: 6, day: 3, year: 2022 });
    expect(parseDateInput('ko-KR', '2022. 06. 03.')).toEqual({ month: 6, day: 3, year: 2022 });
  });

  it('should accept a month and day without padding', () => {
    expect(parseDateInput('en-US', '6/3/2022')).toEqual({ month: 6, day: 3, year: 2022 });
  });

  it('should not accept a date that is still being typed', () => {
    expect(parseDateInput('en-US', '')).toEqual(undefined);
    expect(parseDateInput('en-US', '06/')).toEqual(undefined);
    expect(parseDateInput('en-US', '06/03/')).toEqual(undefined);
    expect(parseDateInput('en-US', '06/03/202')).toEqual(undefined);
  });

  it('should not accept a date that does not exist', () => {
    expect(parseDateInput('en-US', '13/01/2022')).toEqual(undefined);
    expect(parseDateInput('en-US', '00/01/2022')).toEqual(undefined);
    expect(parseDateInput('en-US', '02/30/2022')).toEqual(undefined);
    expect(parseDateInput('en-US', '06/00/2022')).toEqual(undefined);
  });

  it('should accept February 29 only in a leap year', () => {
    expect(parseDateInput('en-US', '02/29/2024')).toEqual({ month: 2, day: 29, year: 2024 });
    expect(parseDateInput('en-US', '02/29/2023')).toEqual(undefined);
  });

  it('should not accept letters or extra numbers', () => {
    expect(parseDateInput('en-US', '06/03/2022a')).toEqual(undefined);
    expect(parseDateInput('en-US', '06/03/2022/1')).toEqual(undefined);
    expect(parseDateInput('en-US', '006/03/2022')).toEqual(undefined);
  });
});
