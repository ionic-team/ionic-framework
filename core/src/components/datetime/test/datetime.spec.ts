import { DatetimeData, daysInMonth, getDateValue, getLocalDateTime, renderDatetime } from '../datetime-util';

describe('Datetime', () => {
  describe('getDateValue()', () => {
    it('it should return the date value for the current day', () => {
      const today = new Date();

      const dayValue = getDateValue({}, 'DD');
      const monthvalue = getDateValue({}, 'MM');
      const yearValue = getDateValue({}, 'YYYY');

      expect(dayValue).toEqual(today.getUTCDate());
      expect(monthvalue).toEqual(today.getUTCMonth() + 1);
      expect(yearValue).toEqual(today.getUTCFullYear());
    });

    it('it should return the date value for a given day', () => {
      const date = new Date('15 October 1995');
      const dateTimeData: DatetimeData = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }

      const dayValue = getDateValue(dateTimeData, 'DD');
      const monthvalue = getDateValue(dateTimeData, 'MM');
      const yearValue = getDateValue(dateTimeData, 'YYYY');

      expect(dayValue).toEqual(date.getDate());
      expect(monthvalue).toEqual(date.getMonth() + 1);
      expect(yearValue).toEqual(date.getFullYear());
    });
  });

  describe('getLocalDateTime()', () => {
    it('should format a datetime string according to the local timezone', () => {

      const dateStringTests = [
        { expectedHourUTC: 12, input: `2019-03-02T12:08:06.601-00:00`, expectedOutput: `2019-03-02T%HOUR%:08:06.601Z` },
        { expectedHourUTC: 12, input: `2019-11-02T12:08:06.601-00:00`, expectedOutput: `2019-11-02T%HOUR%:08:06.601Z` },
        { expectedHourUTC: 8, input: `1994-12-15T13:47:20.789+05:00`, expectedOutput: `1994-12-15T%HOUR%:47:20.789Z` },
        { expectedHourUTC: 18, input: `1994-12-15T13:47:20.789-05:00`, expectedOutput: `1994-12-15T%HOUR%:47:20.789Z` },
        { expectedHourUTC: 9, input: `2019-02-14T09:00:00.000Z`, expectedOutput: `2019-02-14T%HOUR%:00:00.000Z` }
      ];

      dateStringTests.forEach(test => {
        const convertToLocal = getLocalDateTime(test.input);

        const timeZoneOffset = convertToLocal.getTimezoneOffset() / 60;
        const expectedDateString = test.expectedOutput.replace('%HOUR%', padNumber(test.expectedHourUTC - timeZoneOffset));

        expect(convertToLocal.toISOString()).toEqual(expectedDateString);
      });
    });

    it('should format a date string and not get affected by the timezone offset', () => {

      const dateStringTests = [
        { input: '2019-03-20', expectedOutput: '2019-03-20' },
        { input: '1994-04-15', expectedOutput: '1994-04-15' },
        { input: '2008-09-02', expectedOutput: '2008-09-02' },
        { input: '1995-02', expectedOutput: '1995-02' },
        { input: '1994-03-14', expectedOutput: '1994-03-14' },
        { input: '9 01:47', expectedOutput: '09-01T01:47' }
      ];

      dateStringTests.forEach(test => {
        const convertToLocal = getLocalDateTime(test.input);
        expect(convertToLocal.toISOString()).toContain(test.expectedOutput);
      });
    });

    it('should default to today for null and undefined cases', () => {
      const today = new Date();
      const todayString = renderDatetime('YYYY-MM-DD', { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() } )

      const convertToLocalUndefined = getLocalDateTime(undefined);
      expect(convertToLocalUndefined.toISOString()).toContain(todayString);

      const convertToLocalNull = getLocalDateTime(null);
      expect(convertToLocalNull.toISOString()).toContain(todayString);
    });
  });

  describe('daysInMonth()', () => {
    it('should return correct days in month for month and year', () => {
      expect(daysInMonth(1, 2019)).toBe(31);
      expect(daysInMonth(2, 2019)).toBe(28);
      expect(daysInMonth(3, 2019)).toBe(31);
      expect(daysInMonth(4, 2019)).toBe(30);
      expect(daysInMonth(5, 2019)).toBe(31);
      expect(daysInMonth(6, 2019)).toBe(30);
      expect(daysInMonth(7, 2019)).toBe(31);
      expect(daysInMonth(8, 2019)).toBe(31);
      expect(daysInMonth(9, 2019)).toBe(30);
      expect(daysInMonth(10, 2019)).toBe(31);
      expect(daysInMonth(11, 2019)).toBe(30);
      expect(daysInMonth(12, 2019)).toBe(31);
      expect(daysInMonth(2, 2020)).toBe(29);
    });
  });
});

function padNumber(number: number, totalLength: number = 2): string {
  return number.toString().padStart(totalLength, '0');
}
