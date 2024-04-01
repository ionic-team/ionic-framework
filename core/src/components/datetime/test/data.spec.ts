import type { DatetimeParts } from '../datetime-interface';
import {
  generateMonths,
  getDaysOfWeek,
  generateTime,
  getToday,
  getCombinedDateColumnData,
  getTimeColumnsData,
} from '../utils/data';

// The minutes are the same across all hour cycles, so we don't check those
describe('getTimeColumnsData()', () => {
  it('should generate formatted h12 hours and AM/PM data data', () => {
    const refParts = {
      month: 5,
      year: 2021,
      day: 1,
      hour: 4,
      minute: 30,
    };
    const results = getTimeColumnsData(
      'en-US',
      refParts,
      'h12'
    );

    expect(results.hoursData).toEqual([
      { text: '12', value: 0 },
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
      { text: '6', value: 6 },
      { text: '7', value: 7 },
      { text: '8', value: 8 },
      { text: '9', value: 9 },
      { text: '10', value: 10 },
      { text: '11', value: 11 },
    ]);
    expect(
      results.dayPeriodData
    ).toEqual([
      { text: 'AM', value: 'am' },
      { text: 'PM', value: 'pm' },
    ]);
  });
  it('should generate formatted h23 hours and AM/PM data data', () => {
    const refParts = {
      month: 5,
      year: 2021,
      day: 1,
      hour: 4,
      minute: 30,
    };
    const results = getTimeColumnsData(
      'en-US',
      refParts,
      'h23'
    );

    expect(results.hoursData).toEqual([
      { text: '00', value: 0 },
      { text: '01', value: 1 },
      { text: '02', value: 2 },
      { text: '03', value: 3 },
      { text: '04', value: 4 },
      { text: '05', value: 5 },
      { text: '06', value: 6 },
      { text: '07', value: 7 },
      { text: '08', value: 8 },
      { text: '09', value: 9 },
      { text: '10', value: 10 },
      { text: '11', value: 11 },
      { text: '12', value: 12 },
      { text: '13', value: 13 },
      { text: '14', value: 14 },
      { text: '15', value: 15 },
      { text: '16', value: 16 },
      { text: '17', value: 17 },
      { text: '18', value: 18 },
      { text: '19', value: 19 },
      { text: '20', value: 20 },
      { text: '21', value: 21 },
      { text: '22', value: 22 },
      { text: '23', value: 23 },
    ]);
    expect(
      results.dayPeriodData
    ).toEqual([]);
  });
  it('should generate formatted h11 hours and AM/PM data data', () => {
    const refParts = {
      month: 5,
      year: 2021,
      day: 1,
      hour: 4,
      minute: 30,
    };
    const results = getTimeColumnsData(
      'en-US',
      refParts,
      'h11'
    );

    expect(results.hoursData).toEqual([
      { text: '0', value: 0 },
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3 },
      { text: '4', value: 4 },
      { text: '5', value: 5 },
      { text: '6', value: 6 },
      { text: '7', value: 7 },
      { text: '8', value: 8 },
      { text: '9', value: 9 },
      { text: '10', value: 10 },
      { text: '11', value: 11 },
    ]);
    expect(
      results.dayPeriodData
    ).toEqual([
      { text: 'AM', value: 'am' },
      { text: 'PM', value: 'pm' },
    ]);
  });
  it('should generate formatted h24 hours and AM/PM data data', () => {
    const refParts = {
      month: 5,
      year: 2021,
      day: 1,
      hour: 4,
      minute: 30,
    };
    const results = getTimeColumnsData(
      'en-US',
      refParts,
      'h24'
    );

    expect(results.hoursData).toEqual([
      { text: '01', value: 1 },
      { text: '02', value: 2 },
      { text: '03', value: 3 },
      { text: '04', value: 4 },
      { text: '05', value: 5 },
      { text: '06', value: 6 },
      { text: '07', value: 7 },
      { text: '08', value: 8 },
      { text: '09', value: 9 },
      { text: '10', value: 10 },
      { text: '11', value: 11 },
      { text: '12', value: 12 },
      { text: '13', value: 13 },
      { text: '14', value: 14 },
      { text: '15', value: 15 },
      { text: '16', value: 16 },
      { text: '17', value: 17 },
      { text: '18', value: 18 },
      { text: '19', value: 19 },
      { text: '20', value: 20 },
      { text: '21', value: 21 },
      { text: '22', value: 22 },
      { text: '23', value: 23 },
      { text: '24', value: 0 },
    ]);
    expect(
      results.dayPeriodData
    ).toEqual([]);
  });
});

describe('generateMonths()', () => {
  it('should generate correct month data', () => {
    expect(
      generateMonths({
        month: 5,
        year: 2021,
        day: 1,
      })
    ).toEqual([
      { month: 4, year: 2021, day: 1 },
      { month: 5, year: 2021, day: 1 },
      { month: 6, year: 2021, day: 1 },
    ]);
  });
});

describe('getDaysOfWeek()', () => {
  it('should return English short names given a locale and mode', () => {
    expect(
      getDaysOfWeek('en-US', 'ios')
    ).toEqual([
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ]);
  });

  it('should return English narrow names given a locale and mode', () => {
    expect(
      getDaysOfWeek('en-US', 'md')
    ).toEqual([
      'S',
      'M',
      'T',
      'W',
      'T',
      'F',
      'S',
    ]);
  });

  it('should return Spanish short names given a locale and mode', () => {
    expect(
      getDaysOfWeek('es-ES', 'ios')
    ).toEqual([
      'dom',
      'lun',
      'mar',
      'mié',
      'jue',
      'vie',
      'sáb',
    ]);
  });

  it('should return Spanish narrow names given a locale and mode', () => {
    expect(
      getDaysOfWeek('es-ES', 'md')
    ).toEqual([
      'D',
      'L',
      'M',
      'X',
      'J',
      'V',
      'S',
    ]);
  });

  it('should return English short names given a locale, mode and startOfWeek', () => {
    expect(
      getDaysOfWeek('en-US', 'ios', 1)
    ).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ]);
  });
});

describe('generateTime()', () => {
  it('should not filter and hours/minutes when no bounds set', () => {
    const today = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43,
    };
    const { hours, minutes } =
      generateTime('en-US', today);

    expect(hours.length).toEqual(12);
    expect(minutes.length).toEqual(60);
  });
  it('should filter according to min', () => {
    const today = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43,
    };
    const min = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40,
    };
    const { hours, minutes } =
      generateTime(
        'en-US',
        today,
        'h12',
        min
      );

    expect(hours.length).toEqual(10);
    expect(minutes.length).toEqual(60);
  });
  it('should not filter according to min if not on reference day', () => {
    const today = {
      day: 20,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43,
    };
    const min = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40,
    };
    const { hours, minutes } =
      generateTime(
        'en-US',
        today,
        'h12',
        min
      );

    expect(hours.length).toEqual(12);
    expect(minutes.length).toEqual(60);
  });
  it('should filter according to max', () => {
    const today = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 7,
      minute: 43,
    };
    const max = {
      day: 19,
      month: 5,
      year: 2021,
      hour: 7,
      minute: 44,
    };
    const { hours, minutes } =
      generateTime(
        'en-US',
        today,
        'h12',
        undefined,
        max
      );

    expect(hours.length).toEqual(8);
    expect(minutes.length).toEqual(45);
  });
  it('should not filter according to min if not on reference day', () => {
    const today = {
      day: 20,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43,
    };
    const max = {
      day: 21,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40,
    };
    const { hours, minutes } =
      generateTime(
        'en-US',
        today,
        'h12',
        undefined,
        max
      );

    expect(hours.length).toEqual(12);
    expect(minutes.length).toEqual(60);
  });
  it('should return no values for a day less than the min', () => {
    const today = {
      day: 20,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43,
    };
    const min = {
      day: 21,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40,
    };
    const { hours, minutes } =
      generateTime(
        'en-US',
        today,
        'h12',
        min
      );

    expect(hours.length).toEqual(0);
    expect(minutes.length).toEqual(0);
  });
  it('should return no values for a day greater than the max', () => {
    const today = {
      day: 22,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43,
    };
    const max = {
      day: 21,
      month: 5,
      year: 2021,
      hour: 2,
      minute: 40,
    };
    const { hours, minutes } =
      generateTime(
        'en-US',
        today,
        'h12',
        undefined,
        max
      );

    expect(hours.length).toEqual(0);
    expect(minutes.length).toEqual(0);
  });
  it('should allow all hours and minutes if not set in min/max', () => {
    const today = {
      day: 22,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43,
    };
    const min = {
      day: 22,
      month: 5,
      year: 2021,
    };
    const max = {
      day: 22,
      month: 5,
      year: 2021,
    };

    const { hours, minutes } =
      generateTime(
        'en-US',
        today,
        'h12',
        min,
        max
      );

    expect(hours.length).toEqual(12);
    expect(minutes.length).toEqual(60);
  });
  it('should allow certain hours and minutes based on minuteValues and hourValues', () => {
    const today = {
      day: 22,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43,
    };

    const { hours, minutes } =
      generateTime(
        'en-US',
        today,
        'h12',
        undefined,
        undefined,
        [1, 2, 3],
        [10, 15, 20]
      );

    expect(hours).toStrictEqual([
      1, 2, 3,
    ]);
    expect(minutes).toStrictEqual([
      10, 15, 20,
    ]);
  });

  it('should allow both am/pm when min is am and max is pm', () => {
    // https://github.com/ionic-team/ionic-framework/issues/26216
    const today = {
      day: 22,
      month: 5,
      year: 2021,
      hour: 5,
      minute: 43,
    };
    const min = {
      day: 22,
      month: 5,
      year: 2021,
      hour: 11,
      minute: 14,
    };
    const max = {
      day: 22,
      month: 5,
      year: 2021,
      hour: 12,
      minute: 14,
    };

    const { am, pm } = generateTime(
      'en-US',
      today,
      'h12',
      min,
      max
    );

    expect(am).toBe(true);
    expect(pm).toBe(true);
  });

  describe('hourCycle is 23', () => {
    it('should return hours in 24 hour format', () => {
      const refValue = {
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 19,
        minute: 50,
      } as unknown as DatetimeParts;

      const minParts = {
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 19,
        minute: 50,
      } as unknown as DatetimeParts;

      const { hours } = generateTime(
        'en-US',
        refValue,
        'h23',
        minParts
      );

      expect(hours).toStrictEqual([
        19, 20, 21, 22, 23,
      ]);
    });

    describe('current hour is above min hour range', () => {
      it('should return minutes above the min minute range', () => {
        const refValue = {
          day: undefined,
          month: undefined,
          year: undefined,
          hour: 20,
          minute: 22,
        } as unknown as DatetimeParts;

        const minParts = {
          day: undefined,
          month: undefined,
          year: undefined,
          hour: 19,
          minute: 30,
        } as unknown as DatetimeParts;

        const { hours, minutes } =
          generateTime(
            'en-US',
            refValue,
            'h23',
            minParts
          );

        expect(hours).toStrictEqual([
          19, 20, 21, 22, 23,
        ]);
        expect(minutes.length).toEqual(
          60
        );
      });
    });

    it('should respect the min & max bounds', () => {
      const refValue = {
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 20,
        minute: 30,
      } as unknown as DatetimeParts;

      const minParts = {
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 19,
        minute: 30,
      } as unknown as DatetimeParts;

      const maxParts = {
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 20,
        minute: 40,
      } as unknown as DatetimeParts;

      const { hours } = generateTime(
        'en-US',
        refValue,
        'h23',
        minParts,
        maxParts
      );

      expect(hours).toStrictEqual([
        19, 20,
      ]);
    });

    it('should return the filtered minutes when the max bound is set', () => {
      const refValue = {
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 13,
        minute: 0,
      } as unknown as DatetimeParts;

      const maxParts = {
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 13,
        minute: 2,
      } as unknown as DatetimeParts;

      const { minutes } = generateTime(
        'en-US',
        refValue,
        'h23',
        undefined,
        maxParts
      );

      expect(minutes).toStrictEqual([
        0, 1, 2,
      ]);
    });

    it('should not filter minutes when the current hour is less than the max hour bound', () => {
      const refValue = {
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 12,
        minute: 0,
      } as unknown as DatetimeParts;

      const maxParts = {
        day: undefined,
        month: undefined,
        year: undefined,
        hour: 13,
        minute: 2,
      } as unknown as DatetimeParts;

      const { minutes } = generateTime(
        'en-US',
        refValue,
        'h23',
        undefined,
        maxParts
      );

      expect(minutes.length).toEqual(
        60
      );
    });
  });
});

describe('getToday', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    // System time is zero based, 1 = February
    jest.setSystemTime(
      new Date(2022, 1, 21, 18, 30)
    );
  });

  it('should return today without converting to UTC time', () => {
    const res = getToday();

    expect(res).toEqual(
      '2022-02-21T18:30:00.000Z'
    );
  });
});

describe('getCombinedDateColumnData', () => {
  it('should return correct data with dates across years', () => {
    const { parts, items } =
      getCombinedDateColumnData(
        'en-US',
        {
          day: 1,
          month: 1,
          year: 2021,
        },
        {
          day: 31,
          month: 12,
          year: 2020,
        },
        { day: 2, month: 1, year: 2021 }
      );

    expect(parts).toEqual([
      {
        month: 12,
        year: 2020,
        day: 31,
      },
      { month: 1, year: 2021, day: 1 },
      { month: 1, year: 2021, day: 2 },
    ]);
    expect(items).toEqual([
      {
        text: 'Thu, Dec 31',
        value: '2020-12-31',
      },
      {
        text: 'Today',
        value: '2021-1-1',
      },
      {
        text: 'Sat, Jan 2',
        value: '2021-1-2',
      },
    ]);
  });
});
