import type { DatetimeParts } from '../datetime-interface';

import { isAfter, isBefore } from './comparison';

const ISO_8601_REGEXP =
  // eslint-disable-next-line no-useless-escape
  /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
// eslint-disable-next-line no-useless-escape
const TIME_REGEXP = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;

/**
 * Use to convert a string of comma separated numbers or
 * an array of numbers, and clean up any user input
 */
export const convertToArrayOfNumbers = (input?: number[] | number | string): number[] | undefined => {
  if (input === undefined) {
    return;
  }

  let processedInput: any = input;

  if (typeof input === 'string') {
    // convert the string to an array of strings
    // auto remove any whitespace and [] characters
    processedInput = input.replace(/\[|\]|\s/g, '').split(',');
  }

  let values: number[];
  if (Array.isArray(processedInput)) {
    // ensure each value is an actual number in the returned array
    values = processedInput.map((num: any) => parseInt(num, 10)).filter(isFinite);
  } else {
    values = [processedInput as number];
  }

  return values;
};

/**
 * Extracts date information
 * from a .calendar-day element
 * into DatetimeParts.
 */
export const getPartsFromCalendarDay = (el: HTMLElement): DatetimeParts => {
  return {
    month: parseInt(el.getAttribute('data-month')!, 10),
    day: parseInt(el.getAttribute('data-day')!, 10),
    year: parseInt(el.getAttribute('data-year')!, 10),
    dayOfWeek: parseInt(el.getAttribute('data-day-of-week')!, 10),
  };
};

/**
 * Given an ISO-8601 string, format out the parts
 * We do not use the JS Date object here because
 * it adjusts the date for the current timezone.
 */
export function parseDate(val: string): DatetimeParts;
export function parseDate(val: string[]): DatetimeParts[];
export function parseDate(val: undefined | null): undefined;
export function parseDate(val: string | string[]): DatetimeParts | DatetimeParts[];
export function parseDate(val: string | string[] | undefined | null): DatetimeParts | DatetimeParts[] | undefined;
export function parseDate(val: string | string[] | undefined | null): DatetimeParts | DatetimeParts[] | undefined {
  if (Array.isArray(val)) {
    return val.map((valStr) => parseDate(valStr));
  }

  // manually parse IS0 cuz Date.parse cannot be trusted
  // ISO 8601 format: 1994-12-15T13:47:20Z
  let parse: any[] | null = null;

  if (val != null && val !== '') {
    // try parsing for just time first, HH:MM
    parse = TIME_REGEXP.exec(val);
    if (parse) {
      // adjust the array so it fits nicely with the datetime parse
      parse.unshift(undefined, undefined);
      parse[2] = parse[3] = undefined;
    } else {
      // try parsing for full ISO datetime
      parse = ISO_8601_REGEXP.exec(val);
    }
  }

  if (parse === null) {
    // wasn't able to parse the ISO datetime
    return undefined;
  }

  // ensure all the parse values exist with at least 0
  for (let i = 1; i < 8; i++) {
    parse[i] = parse[i] !== undefined ? parseInt(parse[i], 10) : undefined;
  }

  let tzOffset = 0;
  if (parse[9] && parse[10]) {
    // hours
    tzOffset = parseInt(parse[10], 10) * 60;
    if (parse[11]) {
      // minutes
      tzOffset += parseInt(parse[11], 10);
    }
    if (parse[9] === '-') {
      // + or -
      tzOffset *= -1;
    }
  }

  // can also get second and millisecond from parse[6] and parse[7] if needed
  return {
    year: parse[1],
    month: parse[2],
    day: parse[3],
    hour: parse[4],
    minute: parse[5],
    tzOffset,
  };
}

export const clampDate = (
  dateParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts
): DatetimeParts => {
  if (minParts && isBefore(dateParts, minParts)) {
    return minParts;
  } else if (maxParts && isAfter(dateParts, maxParts)) {
    return maxParts;
  }
  return dateParts;
};

/**
 * Parses an hour and returns if the value is in the morning (am) or afternoon (pm).
 * @param hour The hour to format, should be 0-23
 * @returns `pm` if the hour is greater than or equal to 12, `am` if less than 12.
 */
export const parseAmPm = (hour: number) => {
  return hour >= 12 ? 'pm' : 'am';
};
