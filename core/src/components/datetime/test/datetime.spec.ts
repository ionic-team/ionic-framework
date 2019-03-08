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
    it.only('should format a datetime string according to the local timezone', () => {
      const hour = 12;
      const paddedHour = hour.toString().padStart(2, '0');
      
      const timeZoneOffset = new Date().getTimezoneOffset() / 60;
      const hourOffset = (hour - timeZoneOffset).toString().padStart(2, '0');
      
      const dateString = `2019-03-02T${paddedHour}:08:06.601-00:00`;
      const expectedDateString = `2019-03-02T${hourOffset}:08:06.601Z`;
      
      const convertToLocal = getLocalDateTime(dateString).toISOString();
      expect(convertToLocal).toEqual(expectedDateString);
    });
  });
});