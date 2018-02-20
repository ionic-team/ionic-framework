import { isBlank, isPresent, isString } from './util';


export function renderDateTime(template: string, value: DateTimeData, locale: LocaleData) {
  if (isBlank(value)) {
    return '';
  }

  let tokens: string[] = [];
  let hasText = false;
  FORMAT_KEYS.forEach((format, index) => {
    if (template.indexOf(format.f) > -1) {
      const token = '{' + index + '}';
      const text = renderTextFormat(format.f, (<any>value)[format.k], value, locale);

      if (!hasText && text && isPresent((<any>value)[format.k])) {
        hasText = true;
      }

      tokens.push(token, text);

      template = template.replace(format.f, token);
    }
  });

  if (!hasText) {
    return '';
  }

  for (let i = 0; i < tokens.length; i += 2) {
    template = template.replace(tokens[i], tokens[i + 1]);
  }

  return template;
}


export function renderTextFormat(format: string, value: any, date: DateTimeData, locale: LocaleData): string {

  if (format === FORMAT_DDDD || format === FORMAT_DDD) {
    try {
      value = (new Date(date.year, date.month - 1, date.day)).getDay();

      if (format === FORMAT_DDDD) {
        return (isPresent(locale.dayNames) ? locale.dayNames : DAY_NAMES)[value];
      }

      return (isPresent(locale.dayShortNames) ? locale.dayShortNames : DAY_SHORT_NAMES)[value];

    } catch (e) {}

    return '';
  }

  if (format === FORMAT_A) {
    return date ? date.hour < 12 ? 'AM' : 'PM' : isPresent(value) ? value.toUpperCase() : '';
  }

  if (format === FORMAT_a) {
    return date ? date.hour < 12 ? 'am' : 'pm' : isPresent(value) ? value : '';
  }

  if (isBlank(value)) {
    return '';
  }

  if (format === FORMAT_YY || format === FORMAT_MM ||
      format === FORMAT_DD || format === FORMAT_HH ||
      format === FORMAT_mm || format === FORMAT_ss) {
    return twoDigit(value);
  }

  if (format === FORMAT_YYYY) {
    return fourDigit(value);
  }

  if (format === FORMAT_MMMM) {
    return (isPresent(locale.monthNames) ? locale.monthNames : MONTH_NAMES)[value - 1];
  }

  if (format === FORMAT_MMM) {
    return (isPresent(locale.monthShortNames) ? locale.monthShortNames : MONTH_SHORT_NAMES)[value - 1];
  }

  if (format === FORMAT_hh || format === FORMAT_h) {
    if (value === 0) {
      return '12';
    }
    if (value > 12) {
      value -= 12;
    }
    if (format === FORMAT_hh && value < 10) {
      return ('0' + value);
    }
  }

  return value.toString();
}


export function dateValueRange(format: string, min: DateTimeData, max: DateTimeData): any[] {
  let opts: any[] = [];
  let i: number;

  if (format === FORMAT_YYYY || format === FORMAT_YY) {
    // year
    i = max.year;
    while (i >= min.year) {
      opts.push(i--);
    }

  } else if (format === FORMAT_MMMM || format === FORMAT_MMM ||
             format === FORMAT_MM || format === FORMAT_M ||
             format === FORMAT_hh || format === FORMAT_h) {
    // month or 12-hour
    for (i = 1; i < 13; i++) {
      opts.push(i);
    }

  } else if (format === FORMAT_DDDD || format === FORMAT_DDD ||
             format === FORMAT_DD || format === FORMAT_D) {
    // day
    for (i = 1; i < 32; i++) {
      opts.push(i);
    }

  } else if (format === FORMAT_HH || format === FORMAT_H) {
    // 24-hour
    for (i = 0; i < 24; i++) {
      opts.push(i);
    }

  } else if (format === FORMAT_mm || format === FORMAT_m) {
    // minutes
    for (i = 0; i < 60; i++) {
      opts.push(i);
    }

  } else if (format === FORMAT_ss || format === FORMAT_s) {
    // seconds
    for (i = 0; i < 60; i++) {
      opts.push(i);
    }

  } else if (format === FORMAT_A || format === FORMAT_a) {
    // AM/PM
    opts.push('am', 'pm');
  }

  return opts;
}

export function dateSortValue(year: number, month: number, day: number, hour: number = 0, minute: number = 0): number {
  return parseInt(`1${fourDigit(year)}${twoDigit(month)}${twoDigit(day)}${twoDigit(hour)}${twoDigit(minute)}`, 10);
}

export function dateDataSortValue(data: DateTimeData): number {
  if (data) {
    return dateSortValue(data.year, data.month, data.day, data.hour, data.minute);
  }
  return -1;
}

export function daysInMonth(month: number, year: number): number {
  return (month === 4 || month === 6 || month === 9 || month === 11) ? 30 : (month === 2) ? isLeapYear(year) ? 29 : 28 : 31;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}


const ISO_8601_REGEXP = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
const TIME_REGEXP = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;

export function parseDate(val: any): DateTimeData {
  // manually parse IS0 cuz Date.parse cannot be trusted
  // ISO 8601 format: 1994-12-15T13:47:20Z
  let parse: any[];

  if (isPresent(val) && val !== '') {
    // try parsing for just time first, HH:MM
    parse = TIME_REGEXP.exec(val);
    if (isPresent(parse)) {
      // adjust the array so it fits nicely with the datetime parse
      parse.unshift(undefined, undefined);
      parse[2] = parse[3] = undefined;

    } else {
      // try parsing for full ISO datetime
      parse = ISO_8601_REGEXP.exec(val);
    }
  }

  if (isBlank(parse)) {
    // wasn't able to parse the ISO datetime
    return null;
  }

  // ensure all the parse values exist with at least 0
  for (let i = 1; i < 8; i++) {
    parse[i] = (parse[i] !== undefined ? parseInt(parse[i], 10) : null);
  }

  let tzOffset = 0;
  if (isPresent(parse[9]) && isPresent(parse[10])) {
    // hours
    tzOffset = parseInt(parse[10], 10) * 60;
    if (isPresent(parse[11])) {
      // minutes
      tzOffset += parseInt(parse[11], 10);
    }
    if (parse[9] === '-') {
      // + or -
      tzOffset *= -1;
    }
  }

  return {
    year: parse[1],
    month: parse[2],
    day: parse[3],
    hour: parse[4],
    minute: parse[5],
    second: parse[6],
    millisecond: parse[7],
    tzOffset: tzOffset,
  };
}

export function compareDates(d1: DateTimeData, d2: DateTimeData): number {
  const date1 = new Date(d1.year, d1.month, d1.day, d1.hour, d1.minute, d1.second);
  const date2 = new Date(d2.year, d2.month, d2.day, d2.hour, d2.minute, d2.second);

  return date1.getTime() - date2.getTime();
}

export function updateDate(existingData: DateTimeData, newData: any): boolean {
  if (isPresent(newData) && newData !== '') {

    if (isString(newData)) {
      // new date is a string, and hopefully in the ISO format
      // convert it to our DateTimeData if a valid ISO
      newData = parseDate(newData);
      if (newData) {
        // successfully parsed the ISO string to our DateTimeData
        Object.assign(existingData, newData);
        return true;
      }

    } else if ((isPresent(newData.year) || isPresent(newData.hour) || isPresent(newData.month) || isPresent(newData.day) || isPresent(newData.minute) || isPresent(newData.second))) {
      // newData is from of a datetime picker's selected values
      // update the existing DateTimeData data with the new values

      // do some magic for 12-hour values
      if (isPresent(newData.ampm) && isPresent(newData.hour)) {
        if (newData.ampm.value === 'pm') {
          newData.hour.value = (newData.hour.value === 12 ? 12 : newData.hour.value + 12);

        } else {
          newData.hour.value = (newData.hour.value === 12 ? 0 : newData.hour.value);
        }
      }

      // merge new values from the picker's selection
      // to the existing DateTimeData values
      for (const k in newData) {
        (<any>existingData)[k] = newData[k].value;
      }

      return true;
    }

    // eww, invalid data
    console.warn(`Error parsing date: "${newData}". Please provide a valid ISO 8601 datetime format: https://www.w3.org/TR/NOTE-datetime`);

  } else {
    // blank data, clear everything out
    for (const k in existingData) {
      delete (<any>existingData)[k];
    }
  }
  return false;
}


export function parseTemplate(template: string): string[] {
  const formats: string[] = [];

  template = template.replace(/[^\w\s]/gi, ' ');

  FORMAT_KEYS.forEach(format => {
    if (format.f.length > 1 && template.indexOf(format.f) > -1 && template.indexOf(format.f + format.f.charAt(0)) < 0) {
      template = template.replace(format.f, ' ' + format.f + ' ');
    }
  });

  const words = template.split(' ').filter(w => w.length > 0);
  words.forEach((word, i) => {
    FORMAT_KEYS.forEach(format => {
      if (word === format.f) {
        if (word === FORMAT_A || word === FORMAT_a) {
          // this format is an am/pm format, so it's an "a" or "A"
          if ((formats.indexOf(FORMAT_h) < 0 && formats.indexOf(FORMAT_hh) < 0) ||
              VALID_AMPM_PREFIX.indexOf(words[i - 1]) === -1) {
            // template does not already have a 12-hour format
            // or this am/pm format doesn't have a hour, minute, or second format immediately before it
            // so do not treat this word "a" or "A" as the am/pm format
            return;
          }
        }
        formats.push(word);
      }
    });
  });

  return formats;
}


export function getValueFromFormat(date: DateTimeData, format: string) {
  if (format === FORMAT_A || format === FORMAT_a) {
    return (date.hour < 12 ? 'am' : 'pm');
  }
  if (format === FORMAT_hh || format === FORMAT_h) {
    return (date.hour > 12 ? date.hour - 12 : date.hour);
  }
  return (<any>date)[convertFormatToKey(format)];
}


export function convertFormatToKey(format: string): string {
  for (const k in FORMAT_KEYS) {
    if (FORMAT_KEYS[k].f === format) {
      return FORMAT_KEYS[k].k;
    }
  }
  return null;
}


export function convertDataToISO(data: DateTimeData): string {
  // https://www.w3.org/TR/NOTE-datetime
  let rtn = '';

  if (isPresent(data)) {
    if (isPresent(data.year)) {
      // YYYY
      rtn = fourDigit(data.year);

      if (isPresent(data.month)) {
        // YYYY-MM
        rtn += '-' + twoDigit(data.month);

        if (isPresent(data.day)) {
          // YYYY-MM-DD
          rtn += '-' + twoDigit(data.day);

          if (isPresent(data.hour)) {
            // YYYY-MM-DDTHH:mm:SS
            rtn += `T${twoDigit(data.hour)}:${twoDigit(data.minute)}:${twoDigit(data.second)}`;

            if (data.millisecond > 0) {
              // YYYY-MM-DDTHH:mm:SS.SSS
              rtn += '.' + threeDigit(data.millisecond);
            }

            if (isBlank(data.tzOffset) || data.tzOffset === 0) {
              // YYYY-MM-DDTHH:mm:SSZ
              rtn += 'Z';

            } else {
              // YYYY-MM-DDTHH:mm:SS+/-HH:mm
              rtn += (data.tzOffset > 0 ? '+' : '-') + twoDigit(Math.floor(data.tzOffset / 60)) + ':' + twoDigit(data.tzOffset % 60);
            }
          }
        }
      }

    } else if (isPresent(data.hour)) {
      // HH:mm
      rtn = twoDigit(data.hour) + ':' + twoDigit(data.minute);

      if (isPresent(data.second)) {
        // HH:mm:SS
        rtn += ':' + twoDigit(data.second);

        if (isPresent(data.millisecond)) {
          // HH:mm:SS.SSS
          rtn += '.' + threeDigit(data.millisecond);
        }
      }
    }
  }

  return rtn;
}

function twoDigit(val: number): string {
  return ('0' + (isPresent(val) ? Math.abs(val) : '0')).slice(-2);
}

function threeDigit(val: number): string {
  return ('00' + (isPresent(val) ? Math.abs(val) : '0')).slice(-3);
}

function fourDigit(val: number): string {
  return ('000' + (isPresent(val) ? Math.abs(val) : '0')).slice(-4);
}


export interface DateTimeData {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  tzOffset?: number;
}


export interface LocaleData {
  monthNames?: string[];
  monthShortNames?: string[];
  dayNames?: string[];
  dayShortNames?: string[];
}


const FORMAT_YYYY = 'YYYY';
const FORMAT_YY = 'YY';
const FORMAT_MMMM = 'MMMM';
const FORMAT_MMM = 'MMM';
const FORMAT_MM = 'MM';
const FORMAT_M = 'M';
const FORMAT_DDDD = 'DDDD';
const FORMAT_DDD = 'DDD';
const FORMAT_DD = 'DD';
const FORMAT_D = 'D';
const FORMAT_HH = 'HH';
const FORMAT_H = 'H';
const FORMAT_hh = 'hh';
const FORMAT_h = 'h';
const FORMAT_mm = 'mm';
const FORMAT_m = 'm';
const FORMAT_ss = 'ss';
const FORMAT_s = 's';
const FORMAT_A = 'A';
const FORMAT_a = 'a';

const FORMAT_KEYS = [
  { f: FORMAT_YYYY, k: 'year' },
  { f: FORMAT_MMMM, k: 'month' },
  { f: FORMAT_DDDD, k: 'day' },
  { f: FORMAT_MMM, k: 'month' },
  { f: FORMAT_DDD, k: 'day' },
  { f: FORMAT_YY, k: 'year' },
  { f: FORMAT_MM, k: 'month' },
  { f: FORMAT_DD, k: 'day' },
  { f: FORMAT_HH, k: 'hour' },
  { f: FORMAT_hh, k: 'hour' },
  { f: FORMAT_mm, k: 'minute' },
  { f: FORMAT_ss, k: 'second' },
  { f: FORMAT_M, k: 'month' },
  { f: FORMAT_D, k: 'day' },
  { f: FORMAT_H, k: 'hour' },
  { f: FORMAT_h, k: 'hour' },
  { f: FORMAT_m, k: 'minute' },
  { f: FORMAT_s, k: 'second' },
  { f: FORMAT_A, k: 'ampm' },
  { f: FORMAT_a, k: 'ampm' },
];

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DAY_SHORT_NAMES = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const VALID_AMPM_PREFIX = [
  FORMAT_hh, FORMAT_h, FORMAT_mm, FORMAT_m, FORMAT_ss, FORMAT_s
];
