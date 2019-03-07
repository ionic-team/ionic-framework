import { DatetimeOptions } from '../datetime-interface';
import { DatetimeData, getDateValue, cleanFormatString, formatDateValue } from '../datetime-util';
import { format as formatDate } from 'date-fns'

describe('Datetime', () => {
  describe('cleanFormatString()', () => {
    it('should properly clean format strings accoring to the date-fns syntax', () => {
      const dateFormats = [
        ['YYYY', 'yyyy'],
        ['YYYY-MM-DD', 'yyyy-MM-dd'],
        ['YYYY-MM-DDTHH:mm', "yyyy-MM-dd'T'HH:mm"],
        ['YYYY-MM-DDTHH:mm:ssTZD', "yyyy-MM-dd'T'HH:mm:ssXXX"],
        ['DD-dd-DD', "dd-dd-dd"],
      ]
      
      dateFormats.forEach(format => {
        expect(cleanFormatString(format[0])).toEqual(format[1]);
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