import { DatetimeOptions } from '../datetime-interface';
import { DatetimeData, getDateValue, generateTimeZoneAwareDate } from '../datetime-util';

import { parseISO, format } from 'date-fns';
describe('Datetime', () => {
  describe('parseDateValue()', () => {
    it.only('should parse a datetime string', () => {
      const dateString = '1994-12-15T13:47:20.789+05:00';
      const parsedISOString = parseISO(dateString);
      const formattedDate = format(parsedISOString, 'MM');  
      console.log(parsedISOString, formattedDate);
/*
      
      const doParse = parse(dateString, 'YYYY-MM-DDTHH:mmZ', new Date(), { awareOfUnicodeTokens: true });
      console.log('parsed',doParse);
      
      const doParseISO = parseISO(dateString);
      console.log('parsed iso',doParseISO);
      
      const doFormat = format(doParse, 'MM');
      console.log('did format',doFormat)
*/
    });
  }); 
/*
  describe('generateTimeZoneAwareDate()', () => {
    it('should generate a timezone aware UTC-like string', () => {
      const date = new Date("01 March 2019 15:32:05 GMT-0500 (Eastern Standard Time)");
      const getUTCString = generateTimeZoneAwareDate(date, 'America/New_York');
      
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
*/
});