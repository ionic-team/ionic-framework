import { Datetime } from '../datetime';
import { DatetimeOptions } from '../datetime-interface';
import { DatetimeData } from '../datetime-util';

describe('Datetime', () => {
  let datetime;
  beforeEach(() => {
    datetime = new Datetime();
  });
  
  describe('getDateValue()', () => {
    it('it should return the date value for the current day', () => {
      const today = new Date();
      
      const dayValue = datetime.getDateValue({}, 'DD');
      const monthvalue = datetime.getDateValue({}, 'MM');
      const yearValue = datetime.getDateValue({}, 'YYYY');
      
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
      
      const dayValue = datetime.getDateValue(dateTimeData, 'DD');
      const monthvalue = datetime.getDateValue(dateTimeData, 'MM');
      const yearValue = datetime.getDateValue(dateTimeData, 'YYYY');
      
      expect(dayValue).toEqual(date.getDate());
      expect(monthvalue).toEqual(date.getMonth() + 1);
      expect(yearValue).toEqual(date.getFullYear());
    });
  });
});