import { DatetimeOptions } from '../datetime-interface';
import { DatetimeData, getDateValue, generateTimeZoneAwareDate } from '../datetime-util';

describe('Datetime', () => {
  describe('generateTimeZoneAwareDate()', () => {
    it('should generate a timezone aware UTC-like string', () => {
      const date = new Date("01 March 2019 15:32:05 GMT-0500 (Eastern Standard Time)");
      const getUTCString = generateTimeZoneAwareDate(date);
      
      expect(getUTCString).toEqual('2019-03-01T15:32:05.000Z');
    });
  });
  describe('getDateValue()', () => {
    it('should return the date value for the current day', () => {
      const today = new Date();
      
      const dayValue = getDateValue({}, 'DD');
      const monthvalue = getDateValue({}, 'MM');
      const yearValue = getDateValue({}, 'YYYY');
      
      expect(dayValue).toEqual(today.getDate());
      expect(monthvalue).toEqual(today.getMonth() + 1);
      expect(yearValue).toEqual(today.getFullYear());
    });
    
    it('should return the date value for a given day', () => {
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
});