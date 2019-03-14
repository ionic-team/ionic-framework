import { DatetimeData, getDateValue, getLocalDateTime } from '../datetime-util';

describe('Datetime', () => {
  describe('getDateValue()', () => {
    it('it should return the date value for the current day', () => {
      const today = new Date();
      
      const dayValue = getDateValue({}, 'DD');
      const monthvalue = getDateValue({}, 'MM');
      const yearValue = getDateValue({}, 'YYYY');
      
      expect(dayValue).toEqual(today.getDate());
      expect(monthvalue).toEqual(today.getMonth() + 1);
      expect(yearValue).toEqual(today.getFullYear());
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
  });
});

function padNumber(number: number, totalLength: number = 2): string {
  return number.toString().padStart(totalLength, '0');
}