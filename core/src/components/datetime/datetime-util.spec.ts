import { convertDataToISO, parseDate } from './datetime-util';

describe('datetime-util', () => {
  describe('convertDataToISO', () => {
    it('prints an empty string for an empty datetime', () => {
      expect(convertDataToISO({})).toEqual('');
    });

    describe('date', () => {
      it('prints the year', () => {
        expect(convertDataToISO({ year: 2018 })).toEqual('2018');
      });

      it('pads out the year', () => {
        expect(convertDataToISO({ year: 1 })).toEqual('0001');
      });

      it('prints the month', () => {
        expect(convertDataToISO({ year: 2018, month: 12 })).toEqual('2018-12');
      });

      it('pads the month', () => {
        expect(convertDataToISO({ year: 2018, month: 3 })).toEqual('2018-03');
      });

      it('prints the day', () => {
        expect(convertDataToISO({ year: 2018, month: 12, day: 25 })).toEqual(
          '2018-12-25'
        );
      });

      it('pads the day', () => {
        expect(convertDataToISO({ year: 2018, month: 3, day: 13 })).toEqual(
          '2018-03-13'
        );
      });
    });

    describe('time', () => {
      it('prints the hour and minute', () => {
        expect(convertDataToISO({ hour: 15, minute: 32 })).toEqual('15:32');
      });

      it('pads the hour and minute', () => {
        expect(convertDataToISO({ hour: 3, minute: 4 })).toEqual('03:04');
      });

      it('prints seconds', () => {
        expect(convertDataToISO({ hour: 15, minute: 32, second: 42 })).toEqual('15:32:42');
      });

      it('pads seconds', () => {
        expect(convertDataToISO({ hour: 15, minute: 32, second: 2 })).toEqual('15:32:02');
      });

      it('prints milliseconds', () => {
        expect(convertDataToISO({ hour: 15, minute: 32, second:42, millisecond: 143 })).toEqual('15:32:42.143');
      });

      it('pads milliseconds', () => {
        expect(convertDataToISO({ hour: 15, minute: 32, second:42, millisecond: 7 })).toEqual('15:32:42.007');
      });
    });

    describe('date-time', () => {
      it('prints the hours and minutes', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42
          })
        ).toEqual('2018-12-25T14:42:00Z');
      });

      it('pads the hours and minutes', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 0,
            minute: 2
          })
        ).toEqual('2018-12-25T00:02:00Z');
      });

      it('prints the seconds', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42,
            second: 36
          })
        ).toEqual('2018-12-25T14:42:36Z');
      });

      it('pads the seconds', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42,
            second: 3
          })
        ).toEqual('2018-12-25T14:42:03Z');
      });

      it('prints the milliseconds', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42,
            second: 23,
            millisecond: 250
          })
        ).toEqual('2018-12-25T14:42:23.250Z');
      });

      it('pads the milliseconds', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42,
            second: 23,
            millisecond: 25
          })
        ).toEqual('2018-12-25T14:42:23.025Z');
      });

      it('appends a whole hour positive offset timezone', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42,
            tzOffset: 360
          })
        ).toEqual('2018-12-25T14:42:00+06:00');
      });

      it('appends a partial hour positive offset timezone', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42,
            tzOffset: 390
          })
        ).toEqual('2018-12-25T14:42:00+06:30');
      });

      it('appends a whole hour negative offset timezone', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42,
            tzOffset: -300
          })
        ).toEqual('2018-12-25T14:42:00-05:00');
      });

      it('appends a partial hour negative offset timezone', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42,
            tzOffset: -435
          })
        ).toEqual('2018-12-25T14:42:00-07:15');
      });

      it('appends a zero offset timezone', () => {
        expect(
          convertDataToISO({
            year: 2018,
            month: 12,
            day: 25,
            hour: 14,
            minute: 42,
            tzOffset: 0
          })
        ).toEqual('2018-12-25T14:42:00-00:00');
      });
    });
  });

  describe('parseDate', () => {
    it('should parse a single year', () => {
      const date = parseDate('1000');
      expect(date).toEqual({
        "day": undefined,
        "hour": undefined,
        "millisecond": undefined,
        "minute": undefined,
        "month": undefined,
        "second": undefined,
        "tzOffset": 0,
        "year": 1000,
      });
    });

    it('should parse a time', () => {
      const date = parseDate('12:20');
      expect(date).toEqual({
        "day": undefined,
        "hour": 12,
        "millisecond": undefined,
        "minute": 20,
        "month": undefined,
        "second": undefined,
        "tzOffset": 0,
        "year": undefined,
      });
    });

    it('should parse a full ISO date', () => {
      const date = parseDate('1994-12-15T13:47:20Z');
      expect(date).toEqual({
        "day": 15,
        "hour": 13,
        "millisecond": undefined,
        "minute": 47,
        "month": 12,
        "second": 20,
        "tzOffset": 0,
        "year": 1994,
      });
    });

    it('should parse a partial ISO date', () => {
      const date = parseDate('2018-01-02');
      expect(date).toEqual({
        "day": 2,
        "hour": undefined,
        "millisecond": undefined,
        "minute": undefined,
        "month": 1,
        "second": undefined,
        "tzOffset": 0,
        "year": 2018,
      });
    });


    it('should return undefined', () => {
      expect(parseDate(null)).toBeUndefined();
      expect(parseDate(undefined)).toBeUndefined();
      expect(parseDate('')).toBeUndefined();
      expect(parseDate('3432-12-12-234')).toBeUndefined();
    });
  });
});
