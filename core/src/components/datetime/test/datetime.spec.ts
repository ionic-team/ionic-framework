import { DatetimeOptions } from '../datetime-interface';
import { DatetimeData, getDateValue, cleanFormatString, formatDateValue } from '../datetime-util';

describe('Datetime', () => {
  describe('cleanFormatString()', () => {
    it('should properly clean format strings accoring to the date-fns syntax', () => {
      const dateFormats = [
        ['YYYY', 'YYYY'],
        ['YYYY-MM-DD', 'YYYY-MM-dd'],
        ['YYYY-MM-DDTHH:mm', "YYYY-MM-dd'T'HH:mm"],
        ['YYYY-MM-DDTHH:mm:ssTZD', "YYYY-MM-dd'T'HH:mm:ssXXX"],
        ['DD-dd-DD', "dd-dd-dd"],
      ]
      
      dateFormats.forEach(format => {
        expect(cleanFormatString(format[0])).toEqual(format[1]);
      })
    });
  });
  describe('formatDateValue()', () => {
    it('should properly format dates according to time zone and format string', () => {
      const dateFormats = [
        ['1994-12-15T13:47:20.789+05:00', 'YYYY', '1994'],
        ['1994-12-15T13:47:20.789+05:00', 'YYYY-MM-DD', '1994-12-15']
      ]
      
      dateFormats.forEach(format => {
        expect(formatDateValue(format[0], format[1])).toEqual(format[2]);
      })
    });
  });
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
});