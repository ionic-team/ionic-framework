import * as datetime from '../datetime-util';

describe('convertDataToISO', () => {

  it('should convert DateTimeData to datetime string, with blank timezone', () => {
    var data: datetime.DateTimeData = {
      year: 1994,
      month: 12,
      day: 15,
      hour: 13,
      minute: 47,
      second: 20,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('1994-12-15T13:47:20Z');
  });

  it('should convert DateTimeData to datetime string, +330 tz offset', () => {
    var data: datetime.DateTimeData = {
      year: 1994,
      month: 12,
      day: 15,
      hour: 13,
      minute: 47,
      second: 20,
      millisecond: 789,
      tzOffset: 330,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('1994-12-15T13:47:20.789+05:30');
  });

  it('should convert DateTimeData to datetime string, -300 tz offset', () => {
    var data: datetime.DateTimeData = {
      year: 1994,
      month: 12,
      day: 15,
      hour: 13,
      minute: 47,
      second: 20,
      millisecond: 789,
      tzOffset: -300,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('1994-12-15T13:47:20.789-05:00');
  });

  it('should convert DateTimeData to datetime string, Z timezone', () => {
    var data: datetime.DateTimeData = {
      year: 1994,
      month: 12,
      day: 15,
      hour: 13,
      minute: null,
      second: null,
      millisecond: null,
      tzOffset: 0,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('1994-12-15T13:00:00Z');
  });

  it('should convert DateTimeData to YYYY-MM-DD', () => {
    var data: datetime.DateTimeData = {
      year: 1994,
      month: 1,
      day: 1,
      hour: null,
      minute: null,
      second: null,
      millisecond: null,
      tzOffset: 0,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('1994-01-01');
  });

  it('should convert DateTimeData to YYYY-MM', () => {
    var data: datetime.DateTimeData = {
      year: 1994,
      month: 1,
      day: null,
      hour: null,
      minute: null,
      second: null,
      millisecond: null,
      tzOffset: 0,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('1994-01');
  });

  it('should convert DateTimeData to YYYY', () => {
    var data: datetime.DateTimeData = {
      year: 1994,
      month: null,
      day: null,
      hour: null,
      minute: null,
      second: null,
      millisecond: null,
      tzOffset: 0,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('1994');
  });

  it('should convert DateTimeData to HH:mm:SS.SSS', () => {
    var data: datetime.DateTimeData = {
      year: null,
      month: null,
      day: null,
      hour: 13,
      minute: 47,
      second: 20,
      millisecond: 789,
      tzOffset: 0,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('13:47:20.789');
  });

  it('should convert DateTimeData to HH:mm:ss string', () => {
    var data: datetime.DateTimeData = {
      year: null,
      month: null,
      day: null,
      hour: 13,
      minute: 47,
      second: 20,
      millisecond: null,
      tzOffset: 0,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('13:47:20');
  });

  it('should convert DateTimeData to HH:mm string', () => {
    var data: datetime.DateTimeData = {
      year: null,
      month: null,
      day: null,
      hour: 13,
      minute: 47,
      second: null,
      millisecond: null,
      tzOffset: 0,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('13:47');
  });

  it('should not convert DateTimeData with null data', () => {
    var data: datetime.DateTimeData = {
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null,
      second: null,
      millisecond: null,
      tzOffset: 0,
    };

    var str = datetime.convertDataToISO(data);
    expect(str).toEqual('');

    str = datetime.convertDataToISO({});
    expect(str).toEqual('');
  });

});


describe('convertFormatToKey', () => {

  it('should convert year formats to their DateParse key', () => {
    expect(datetime.convertFormatToKey('YYYY')).toEqual('year');
    expect(datetime.convertFormatToKey('YY')).toEqual('year');
  });

  it('should convert month formats to their DateParse key', () => {
    expect(datetime.convertFormatToKey('MMMM')).toEqual('month');
    expect(datetime.convertFormatToKey('MMM')).toEqual('month');
    expect(datetime.convertFormatToKey('MM')).toEqual('month');
    expect(datetime.convertFormatToKey('M')).toEqual('month');
  });

  it('should convert day formats to their DateParse key', () => {
    expect(datetime.convertFormatToKey('DDDD')).toEqual('day');
    expect(datetime.convertFormatToKey('DDD')).toEqual('day');
    expect(datetime.convertFormatToKey('DD')).toEqual('day');
    expect(datetime.convertFormatToKey('D')).toEqual('day');
  });

  it('should convert hour formats to their DateParse key', () => {
    expect(datetime.convertFormatToKey('HH')).toEqual('hour');
    expect(datetime.convertFormatToKey('H')).toEqual('hour');
    expect(datetime.convertFormatToKey('hh')).toEqual('hour');
    expect(datetime.convertFormatToKey('h')).toEqual('hour');
  });

  it('should convert minute formats to their DateParse key', () => {
    expect(datetime.convertFormatToKey('mm')).toEqual('minute');
    expect(datetime.convertFormatToKey('m')).toEqual('minute');
  });

  it('should convert second formats to their DateParse key', () => {
    expect(datetime.convertFormatToKey('ss')).toEqual('second');
    expect(datetime.convertFormatToKey('s')).toEqual('second');
  });

  it('should convert am/pm formats to their DateParse key', () => {
    expect(datetime.convertFormatToKey('A')).toEqual('ampm');
    expect(datetime.convertFormatToKey('a')).toEqual('ampm');
  });

});


describe('getValueFromFormat', () => {

  it('should convert 24 hour to am value', () => {
    var d = datetime.parseDate('00:47');
    expect(datetime.getValueFromFormat(d, 'hh')).toEqual(0);
    expect(datetime.getValueFromFormat(d, 'h')).toEqual(0);

    d = datetime.parseDate('11:47');
    expect(datetime.getValueFromFormat(d, 'hh')).toEqual(11);
    expect(datetime.getValueFromFormat(d, 'h')).toEqual(11);
  });

  it('should convert 24 hour to pm value', () => {
    var d = datetime.parseDate('12:47');
    expect(datetime.getValueFromFormat(d, 'hh')).toEqual(12);
    expect(datetime.getValueFromFormat(d, 'h')).toEqual(12);

    d = datetime.parseDate('13:47');
    expect(datetime.getValueFromFormat(d, 'hh')).toEqual(1);
    expect(datetime.getValueFromFormat(d, 'h')).toEqual(1);
  });

  it('should convert am hours to am value', () => {
    var d = datetime.parseDate('00:47');
    expect(datetime.getValueFromFormat(d, 'A')).toEqual('am');
    expect(datetime.getValueFromFormat(d, 'a')).toEqual('am');

    d = datetime.parseDate('11:47');
    expect(datetime.getValueFromFormat(d, 'A')).toEqual('am');
    expect(datetime.getValueFromFormat(d, 'a')).toEqual('am');
  });

  it('should convert pm hours to pm value', () => {
    var d = datetime.parseDate('12:47');
    expect(datetime.getValueFromFormat(d, 'A')).toEqual('pm');
    expect(datetime.getValueFromFormat(d, 'a')).toEqual('pm');

    d = datetime.parseDate('23:47');
    expect(datetime.getValueFromFormat(d, 'A')).toEqual('pm');
    expect(datetime.getValueFromFormat(d, 'a')).toEqual('pm');
  });

  it('should convert date formats to values', () => {
    var d = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(datetime.getValueFromFormat(d, 'YYYY')).toEqual(1994);
    expect(datetime.getValueFromFormat(d, 'M')).toEqual(12);
    expect(datetime.getValueFromFormat(d, 'DDDD')).toEqual(15);
  });

});


describe('parseTemplate', () => {

  it('should not parse D thats apart of a word', () => {
    var formats = datetime.parseTemplate('D Days');
    expect(formats.length).toEqual(1);
    expect(formats[0]).toEqual('D');
  });

  it('should not parse D thats apart of a word', () => {
    var formats = datetime.parseTemplate('DD Days');
    expect(formats.length).toEqual(1);
    expect(formats[0]).toEqual('DD');
  });

  it('should not parse m thats apart of a word', () => {
    var formats = datetime.parseTemplate('m mins');
    expect(formats.length).toEqual(1);
    expect(formats[0]).toEqual('m');
  });

  it('should not parse M thats apart of a word', () => {
    var formats = datetime.parseTemplate('mm Minutes');
    expect(formats.length).toEqual(1);
    expect(formats[0]).toEqual('mm');
  });

  it('should not pickup "a" within 12-hour, but its not the am/pm', () => {
    var formats = datetime.parseTemplate('hh:mm is a time');
    expect(formats.length).toEqual(2);
    expect(formats[0]).toEqual('hh');
    expect(formats[1]).toEqual('mm');
  });

  it('should allow am/pm when using 12-hour and no spaces', () => {
    var formats = datetime.parseTemplate('hh:mma');
    expect(formats.length).toEqual(3);
    expect(formats[0]).toEqual('hh');
    expect(formats[1]).toEqual('mm');
    expect(formats[2]).toEqual('a');
  });

  it('should allow am/pm when using only 12-hour', () => {
    var formats = datetime.parseTemplate('hh a');
    expect(formats.length).toEqual(2);
    expect(formats[0]).toEqual('hh');
    expect(formats[1]).toEqual('a');
  });

  it('should allow am/pm when using 12-hour', () => {
    var formats = datetime.parseTemplate('hh:mm a');
    expect(formats.length).toEqual(3);
    expect(formats[0]).toEqual('hh');
    expect(formats[1]).toEqual('mm');
    expect(formats[2]).toEqual('a');
  });

  it('should not add am/pm when using 24-hour', () => {
    var formats = datetime.parseTemplate('HH:mm a');
    expect(formats.length).toEqual(2);
    expect(formats[0]).toEqual('HH');
    expect(formats[1]).toEqual('mm');
  });

  it('should get formats from template "s ss m mm h hh H HH D DD DDD DDDD M MM MMM MMMM YY YYYY"', () => {
    var formats = datetime.parseTemplate('s ss m mm h hh H HH D DD DDD DDDD M MM MMM MMMM YY YYYY');
    expect(formats[0]).toEqual('s');
    expect(formats[1]).toEqual('ss');
    expect(formats[2]).toEqual('m');
    expect(formats[3]).toEqual('mm');
    expect(formats[4]).toEqual('h');
    expect(formats[5]).toEqual('hh');
    expect(formats[6]).toEqual('H');
    expect(formats[7]).toEqual('HH');
    expect(formats[8]).toEqual('D');
    expect(formats[9]).toEqual('DD');
    expect(formats[10]).toEqual('DDD');
    expect(formats[11]).toEqual('DDDD');
    expect(formats[12]).toEqual('M');
    expect(formats[13]).toEqual('MM');
    expect(formats[14]).toEqual('MMM');
    expect(formats[15]).toEqual('MMMM');
    expect(formats[16]).toEqual('YY');
    expect(formats[17]).toEqual('YYYY');
  });

  it('should get formats from template YYMMMMDDHHmm', () => {
    var formats = datetime.parseTemplate('YYMMMMDDHHmm');
    expect(formats[0]).toEqual('YY');
    expect(formats[1]).toEqual('MMMM');
    expect(formats[2]).toEqual('DD');
    expect(formats[3]).toEqual('HH');
    expect(formats[4]).toEqual('mm');
  });

  it('should get formats from template MM/DD/YYYY', () => {
    var formats = datetime.parseTemplate('MM/DD/YYYY');
    expect(formats[0]).toEqual('MM');
    expect(formats[1]).toEqual('DD');
    expect(formats[2]).toEqual('YYYY');
  });

});

describe('renderDateTime', () => {

  it('should show correct month and day name defaults', () => {
    var d = datetime.parseDate('2016-05-12');
    var r = datetime.renderDateTime('DDDD MMM D YYYY', d, {});
    expect(r).toEqual('Thursday May 12 2016');
  });

  it('should format h:mm a, PM', () => {
    var d = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(datetime.renderDateTime('h:mm a', d, {})).toEqual('1:47 pm');
  });

  it('should get empty text for format without data', () => {
    var emptyObj = {};
    expect(datetime.renderDateTime('MMMM D, YYYY h:mm a', emptyObj, {})).toEqual('');

    var dataWithNulls: datetime.DateTimeData = {
      year: null,
      month: null,
      day: null,
      hour: null,
      minute: null,
      second: null,
      millisecond: null,
      tzOffset: 0,
    };
    expect(datetime.renderDateTime('MMMM D, YYYY h:mm a', dataWithNulls, {})).toEqual('');
  });

  it('should format h:mm a, AM', () => {
    var d = datetime.parseDate('1994-12-15T00:47:20.789Z');
    expect(datetime.renderDateTime('h:mm a', d, {})).toEqual('12:47 am');
  });

  it('should format HH:mm', () => {
    var d = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(datetime.renderDateTime('HH:mm', d, {})).toEqual('13:47');
  });

  it('should format MMMM D, YYYY', () => {
    var d = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(datetime.renderDateTime('MMMM D, YYYY', d, {})).toEqual('December 15, 1994');
  });

  it('should format MM/DD/YYYY', () => {
    var d = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(datetime.renderDateTime('MM/DD/YYYY', d, {})).toEqual('12/15/1994');
  });

  it('should format DD-MM-YY', () => {
    var d = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(datetime.renderDateTime('DD-MM-YY', d, {})).toEqual('15-12-94');
  });

  it('should format YYYY', () => {
    var d = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(datetime.renderDateTime('DD-MM-YY', d, {})).toEqual('15-12-94');
  });

  it('should format YYYY$MM.DD*HH?mm', () => {
    var d = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(datetime.renderDateTime('YYYY$MM.DD*HH?mm', d, {})).toEqual('1994$12.15*13?47');
  });

  it('should return empty when template invalid', () => {
    var d = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(datetime.renderDateTime('', d, {})).toEqual('');
  });

  it('should return empty when date invalid', () => {
    var d = datetime.parseDate(null);
    expect(datetime.renderDateTime('YYYY', d, {})).toEqual('');
  });

});

describe('renderTextFormat', () => {

  it('should return a', () => {
    var d = datetime.parseDate('00:47');
    expect(datetime.renderTextFormat('a', 'am', d, {})).toEqual('am');
    expect(datetime.renderTextFormat('a', 'am', null, {})).toEqual('am');

    d = datetime.parseDate('11:47');
    expect(datetime.renderTextFormat('a', 'am', d, {})).toEqual('am');
    expect(datetime.renderTextFormat('a', 'am', null, {})).toEqual('am');

    d = datetime.parseDate('12:47');
    expect(datetime.renderTextFormat('a', 'pm', d, {})).toEqual('pm');
    expect(datetime.renderTextFormat('a', 'pm', null, {})).toEqual('pm');
  });

  it('should return A', () => {
    var d = datetime.parseDate('00:47');
    expect(datetime.renderTextFormat('A', 'am', d, {})).toEqual('AM');
    expect(datetime.renderTextFormat('A', 'am', null, {})).toEqual('AM');

    d = datetime.parseDate('11:47');
    expect(datetime.renderTextFormat('A', 'am', d, {})).toEqual('AM');
    expect(datetime.renderTextFormat('A', 'am', null, {})).toEqual('AM');

    d = datetime.parseDate('12:47');
    expect(datetime.renderTextFormat('A', 'pm', d, {})).toEqual('PM');
    expect(datetime.renderTextFormat('A', 'pm', null, {})).toEqual('PM');
  });

  it('should return m', () => {
    expect(datetime.renderTextFormat('m', 1, null, {})).toEqual('1');
    expect(datetime.renderTextFormat('m', 12, null, {})).toEqual('12');
  });

  it('should return mm', () => {
    expect(datetime.renderTextFormat('mm', 1, null, {})).toEqual('01');
    expect(datetime.renderTextFormat('mm', 12, null, {})).toEqual('12');
  });

  it('should return hh', () => {
    expect(datetime.renderTextFormat('hh', 0, null, {})).toEqual('12');
    expect(datetime.renderTextFormat('hh', 1, null, {})).toEqual('01');
    expect(datetime.renderTextFormat('hh', 11, null, {})).toEqual('11');
    expect(datetime.renderTextFormat('hh', 12, null, {})).toEqual('12');
    expect(datetime.renderTextFormat('hh', 13, null, {})).toEqual('01');
    expect(datetime.renderTextFormat('hh', 21, null, {})).toEqual('09');
    expect(datetime.renderTextFormat('hh', 23, null, {})).toEqual('11');
  });

  it('should return h', () => {
    expect(datetime.renderTextFormat('h', 0, null, {})).toEqual('12');
    expect(datetime.renderTextFormat('h', 1, null, {})).toEqual('1');
    expect(datetime.renderTextFormat('h', 11, null, {})).toEqual('11');
    expect(datetime.renderTextFormat('h', 12, null, {})).toEqual('12');
    expect(datetime.renderTextFormat('h', 13, null, {})).toEqual('1');
    expect(datetime.renderTextFormat('h', 21, null, {})).toEqual('9');
    expect(datetime.renderTextFormat('h', 23, null, {})).toEqual('11');
  });

  it('should return hh', () => {
    expect(datetime.renderTextFormat('hh', 1, null, {})).toEqual('01');
    expect(datetime.renderTextFormat('hh', 12, null, {})).toEqual('12');
  });

  it('should return H', () => {
    expect(datetime.renderTextFormat('H', 1, null, {})).toEqual('1');
    expect(datetime.renderTextFormat('H', 12, null, {})).toEqual('12');
  });

  it('should return HH', () => {
    expect(datetime.renderTextFormat('HH', 1, null, {})).toEqual('01');
    expect(datetime.renderTextFormat('HH', 12, null, {})).toEqual('12');
  });

  it('should return D', () => {
    expect(datetime.renderTextFormat('D', 1, null, {})).toEqual('1');
    expect(datetime.renderTextFormat('D', 12, null, {})).toEqual('12');
  });

  it('should return DD', () => {
    expect(datetime.renderTextFormat('DD', 1, null, {})).toEqual('01');
    expect(datetime.renderTextFormat('DD', 12, null, {})).toEqual('12');
  });

  it('should return DDD', () => {
    var d: datetime.DateTimeData = {
      year: 2016,
      month: 5,
      day: 12,
    };

    expect(datetime.renderTextFormat('DDD', null, d, {})).toEqual('Thu');
  });

  it('should return DDD with custom locale', () => {
    var d: datetime.DateTimeData = {
      year: 2016,
      month: 5,
      day: 12,
    };

    expect(datetime.renderTextFormat('DDD', null, d, customLocale)).toEqual('qui');
  });

  it('should return DDDD', () => {
    var d: datetime.DateTimeData = {
      year: 2016,
      month: 5,
      day: 12,
    };

    expect(datetime.renderTextFormat('DDDD', null, d, {})).toEqual('Thursday');
  });

  it('should return DDDD with custom locale', () => {
    var d: datetime.DateTimeData = {
      year: 2016,
      month: 5,
      day: 12,
    };

    expect(datetime.renderTextFormat('DDDD', null, d, customLocale)).toEqual('quinta-feira');
  });

  it('should return M', () => {
    expect(datetime.renderTextFormat('M', 1, null, {})).toEqual('1');
    expect(datetime.renderTextFormat('M', 12, null, {})).toEqual('12');
  });

  it('should return MM', () => {
    expect(datetime.renderTextFormat('MM', 1, null, {})).toEqual('01');
    expect(datetime.renderTextFormat('MM', 12, null, {})).toEqual('12');
  });

  it('should return MMM', () => {
    expect(datetime.renderTextFormat('MMM', 1, null, {})).toEqual('Jan');
    expect(datetime.renderTextFormat('MMM', 12, null, {})).toEqual('Dec');
  });

  it('should return MMM with custom locale', () => {
    expect(datetime.renderTextFormat('MMM', 1, null, customLocale)).toEqual('jan');
  });

  it('should return MMMM', () => {
    expect(datetime.renderTextFormat('MMMM', 1, null, {})).toEqual('January');
    expect(datetime.renderTextFormat('MMMM', 12, null, {})).toEqual('December');
  });

  it('should return MMMM with custom locale', () => {
    expect(datetime.renderTextFormat('MMMM', 1, null, customLocale)).toEqual('janeiro');
  });

  it('should return YY', () => {
    expect(datetime.renderTextFormat('YY', 1994, null, {})).toEqual('94');
    expect(datetime.renderTextFormat('YY', 94, null, {})).toEqual('94');
  });

  it('should return YYYY', () => {
    expect(datetime.renderTextFormat('YYYY', 1994, null, {})).toEqual('1994');
    expect(datetime.renderTextFormat('YYYY', 0, null, {})).toEqual('0000');
  });

  it('should return empty when blank', () => {
    expect(datetime.renderTextFormat(null, null, null, {})).toEqual('');
    expect(datetime.renderTextFormat(null, 1994, null, {})).toEqual('1994');
  });

});

describe('parseISODate', () => {

  it('should get HH:MM:SS.SSS+HH:MM', () => {
    var parsed = datetime.parseDate('13:47:20.789+05:30');
    expect(parsed.year).toEqual(null);
    expect(parsed.month).toEqual(null);
    expect(parsed.day).toEqual(null);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(20);
    expect(parsed.millisecond).toEqual(789);
    expect(parsed.tzOffset).toEqual(330);
  });

  it('should get HH:MM:SS.SSS', () => {
    var parsed = datetime.parseDate('13:47:20.789');
    expect(parsed.year).toEqual(null);
    expect(parsed.month).toEqual(null);
    expect(parsed.day).toEqual(null);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(20);
    expect(parsed.millisecond).toEqual(789);
    expect(parsed.tzOffset).toEqual(0);
  });

  it('should get HH:MM:SS', () => {
    var parsed = datetime.parseDate('13:47:20');
    expect(parsed.year).toEqual(null);
    expect(parsed.month).toEqual(null);
    expect(parsed.day).toEqual(null);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(20);
    expect(parsed.millisecond).toEqual(null);
    expect(parsed.tzOffset).toEqual(0);
  });

  it('should get HH:MM', () => {
    var parsed = datetime.parseDate('13:47');
    expect(parsed.year).toEqual(null);
    expect(parsed.month).toEqual(null);
    expect(parsed.day).toEqual(null);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(null);
    expect(parsed.millisecond).toEqual(null);
    expect(parsed.tzOffset).toEqual(0);
  });

  it('should get YYYY-MM-DDTHH:MM:SS.SSS+HH:MM', () => {
    var parsed = datetime.parseDate('1994-12-15T13:47:20.789+05:30');
    expect(parsed.year).toEqual(1994);
    expect(parsed.month).toEqual(12);
    expect(parsed.day).toEqual(15);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(20);
    expect(parsed.millisecond).toEqual(789);
    expect(parsed.tzOffset).toEqual(330);
  });

  it('should get YYYY-MM-DDTHH:MM:SS.SSS-HH:MM', () => {
    var parsed = datetime.parseDate('1994-12-15T13:47:20.789-11:45');
    expect(parsed.year).toEqual(1994);
    expect(parsed.month).toEqual(12);
    expect(parsed.day).toEqual(15);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(20);
    expect(parsed.millisecond).toEqual(789);
    expect(parsed.tzOffset).toEqual(-705);
  });

  it('should get YYYY-MM-DDTHH:MM:SS.SSS-HH', () => {
    var parsed = datetime.parseDate('1994-12-15T13:47:20.789-02');
    expect(parsed.year).toEqual(1994);
    expect(parsed.month).toEqual(12);
    expect(parsed.day).toEqual(15);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(20);
    expect(parsed.millisecond).toEqual(789);
    expect(parsed.tzOffset).toEqual(-120);
  });

  it('should get YYYY-MM-DDTHH:MM:SS.SSSZ and set UTC offset', () => {
    var parsed = datetime.parseDate('1994-12-15T13:47:20.789Z');
    expect(parsed.year).toEqual(1994);
    expect(parsed.month).toEqual(12);
    expect(parsed.day).toEqual(15);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(20);
    expect(parsed.millisecond).toEqual(789);
    expect(parsed.tzOffset).toEqual(0);
  });

  it('should get YYYY-MM-DDTHH:MM:SS', () => {
    var parsed = datetime.parseDate('1994-12-15T13:47:20');
    expect(parsed.year).toEqual(1994);
    expect(parsed.month).toEqual(12);
    expect(parsed.day).toEqual(15);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(20);
    expect(parsed.millisecond).toEqual(null);
    expect(parsed.tzOffset).toEqual(0);
  });

  it('should get YYYY-MM-DDTHH:MM', () => {
    var parsed = datetime.parseDate('1994-12-15T13:47');
    expect(parsed.year).toEqual(1994);
    expect(parsed.month).toEqual(12);
    expect(parsed.day).toEqual(15);
    expect(parsed.hour).toEqual(13);
    expect(parsed.minute).toEqual(47);
    expect(parsed.second).toEqual(null);
    expect(parsed.millisecond).toEqual(null);
    expect(parsed.tzOffset).toEqual(0);
  });

  it('should NOT work with YYYY-MM-DDTHH', () => {
    var parsed = datetime.parseDate('1994-12-15T13');
    expect(parsed).toEqual(null);
  });

  it('should get YYYY-MM-DD', () => {
    var parsed = datetime.parseDate('1994-12-15');
    expect(parsed.year).toEqual(1994);
    expect(parsed.month).toEqual(12);
    expect(parsed.day).toEqual(15);
    expect(parsed.hour).toEqual(null);
    expect(parsed.minute).toEqual(null);
    expect(parsed.second).toEqual(null);
    expect(parsed.millisecond).toEqual(null);
    expect(parsed.tzOffset).toEqual(0);
  });

  it('should get YYYY-MM', () => {
    var parsed = datetime.parseDate('1994-12');
    expect(parsed.year).toEqual(1994);
    expect(parsed.month).toEqual(12);
    expect(parsed.day).toEqual(null);
    expect(parsed.hour).toEqual(null);
    expect(parsed.minute).toEqual(null);
    expect(parsed.second).toEqual(null);
    expect(parsed.millisecond).toEqual(null);
    expect(parsed.tzOffset).toEqual(0);
  });

  it('should get YYYY', () => {
    var parsed = datetime.parseDate('1994');
    expect(parsed.year).toEqual(1994);
    expect(parsed.month).toEqual(null);
    expect(parsed.day).toEqual(null);
    expect(parsed.hour).toEqual(null);
    expect(parsed.minute).toEqual(null);
    expect(parsed.second).toEqual(null);
    expect(parsed.millisecond).toEqual(null);
    expect(parsed.tzOffset).toEqual(0);
  });

  it('should handle bad date formats', () => {
    var parsed = datetime.parseDate('12/15/1994');
    expect(parsed).toEqual(null);

    parsed = datetime.parseDate('12-15-1994');
    expect(parsed).toEqual(null);

    parsed = datetime.parseDate('1994-1994');
    expect(parsed).toEqual(null);

    parsed = datetime.parseDate('1994 12 15');
    expect(parsed).toEqual(null);

    parsed = datetime.parseDate('12.15.1994');
    expect(parsed).toEqual(null);

    parsed = datetime.parseDate('12\\15\\1994');
    expect(parsed).toEqual(null);

    parsed = datetime.parseDate('200');
    expect(parsed).toEqual(null);

    parsed = datetime.parseDate('holla');
    expect(parsed).toEqual(null);
  });

  it('should get nothing with null date', () => {
    var parsed = datetime.parseDate(null);
    expect(parsed).toEqual(null);

    parsed = datetime.parseDate(undefined);
    expect(parsed).toEqual(null);

    parsed = datetime.parseDate('');
    expect(parsed).toEqual(null);
  });

});

describe('updateDate', () => {

  it('should update year in existing date', () => {
    var existingDate = { year: 2016, month: 10, day: 1 };
    datetime.updateDate(existingDate, { year: { value: 2017 } });
    expect(existingDate.year).toEqual(2017);
  });

  it('should update month in existing date', () => {
    var existingDate = { year: 2016, month: 10, day: 1 };
    datetime.updateDate(existingDate, { month: { value: 11 } });
    expect(existingDate.month).toEqual(11);
  });

  it('should update day in existing date', () => {
    var existingDate = { year: 2016, month: 10, day: 1 };
    datetime.updateDate(existingDate, { day: { value: 2 } });
    expect(existingDate.day).toEqual(2);
  });

  it('should update hour in existing time', () => {
    var existingDate = { hour: 10, minute: 30, second: 0 };
    datetime.updateDate(existingDate, { hour: { value: 11 } });
    expect(existingDate.hour).toEqual(11);
  });

  it('should update minute in existing time', () => {
    var existingDate = { hour: 10, minute: 30, second: 0 };
    datetime.updateDate(existingDate, { minute: { value: 45 } });
    expect(existingDate.minute).toEqual(45);
  });

  it('should update second in existing time', () => {
    var existingDate = { hour: 10, minute: 30, second: 0 };
    datetime.updateDate(existingDate, { second: { value: 10 } });
    expect(existingDate.second).toEqual(10);
  });

  it('should update hour PM in existing time', () => {
    var existingDate = { hour: 10, minute: 30, second: 0 };
    datetime.updateDate(existingDate, { hour: { value: 1 }, ampm: { value: 'pm' }});
    expect(existingDate.hour).toEqual(13);

    existingDate = { hour: 10, minute: 30, second: 0 };
    datetime.updateDate(existingDate, { hour: { value: 12 }, ampm: { value: 'pm' }});
    expect(existingDate.hour).toEqual(12);

    existingDate = { hour: 10, minute: 30, second: 0 };
    datetime.updateDate(existingDate, { hour: { value: 4 }, ampm: { value: 'pm' }});
    expect(existingDate.hour).toEqual(16);
  });

  it('should update hour AM in existing time', () => {
    var existingDate = { hour: 10, minute: 30, second: 0 };
    datetime.updateDate(existingDate, { hour: { value: 1 }, ampm: { value: 'am' }});
    expect(existingDate.hour).toEqual(1);

    existingDate = { hour: 10, minute: 30, second: 0 };
    datetime.updateDate(existingDate, { hour: { value: 12 }, ampm: { value: 'am' }});
    expect(existingDate.hour).toEqual(0);

    existingDate = { hour: 10, minute: 30, second: 0 };
    datetime.updateDate(existingDate, { hour: { value: 4 }, ampm: { value: 'am' }});
    expect(existingDate.hour).toEqual(4);
  });

});

// pt-br
var customLocale: datetime.LocaleData = {
  dayNames: [
    'domingo',
    'segunda-feira',
    'ter\u00e7a-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    's\u00e1bado'
  ],
  dayShortNames: [
    'dom',
    'seg',
    'ter',
    'qua',
    'qui',
    'sex',
    's\u00e1b'
  ],
  monthNames: [
    'janeiro',
    'fevereiro',
    'mar\u00e7o',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro'
  ],
  monthShortNames: [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez'
  ],
};
