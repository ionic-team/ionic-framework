import { printIonWarning } from '@utils/logging';

import type { DatetimeParts } from '../datetime-interface';

import { isAfter, isBefore } from './comparison';
import { getNumDaysInMonth } from './helpers';

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
export function parseDate(val: string): DatetimeParts | undefined;
export function parseDate(val: string[]): DatetimeParts[] | undefined;
export function parseDate(val: undefined | null): undefined;
export function parseDate(val: string | string[]): DatetimeParts | DatetimeParts[] | undefined;
export function parseDate(val: string | string[] | undefined | null): DatetimeParts | DatetimeParts[] | undefined;
export function parseDate(val: string | string[] | undefined | null): DatetimeParts | DatetimeParts[] | undefined {
  if (Array.isArray(val)) {
    const parsedArray: DatetimeParts[] = [];
    for (const valStr of val) {
      const parsedVal = parseDate(valStr);

      /**
       * If any of the values weren't parsed correctly, consider
       * the entire batch incorrect. This simplifies the type
       * signatures by having "undefined" be a general error case
       * instead of returning (Datetime | undefined)[], which is
       * harder for TS to perform type narrowing on.
       */
      if (!parsedVal) {
        return undefined;
      }

      parsedArray.push(parsedVal);
    }

    return parsedArray;
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
    printIonWarning(`Unable to parse date string: ${val}. Please provide a valid ISO 8601 datetime string.`);
    return undefined;
  }

  // ensure all the parse values exist with at least 0
  for (let i = 1; i < 8; i++) {
    parse[i] = parse[i] !== undefined ? parseInt(parse[i], 10) : undefined;
  }

  // can also get second and millisecond from parse[6] and parse[7] if needed
  return {
    year: parse[1],
    month: parse[2],
    day: parse[3],
    hour: parse[4],
    minute: parse[5],
    ampm: parse[4] < 12 ? 'am' : 'pm',
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

/**
 * Takes a max date string and creates a DatetimeParts
 * object, filling in any missing information.
 * For example, max="2012" would fill in the missing
 * month, day, hour, and minute information.
 */
export const parseMaxParts = (max: string, todayParts: DatetimeParts): DatetimeParts | undefined => {
  const result = parseDate(max);

  /**
   * If min was not a valid date then return undefined.
   */
  if (result === undefined) {
    return;
  }

  const { month, day, year, hour, minute } = result;

  /**
   * When passing in `max` or `min`, developers
   * can pass in any ISO-8601 string. This means
   * that not all of the date/time fields are defined.
   * For example, passing max="2012" is valid even though
   * there is no month, day, hour, or minute data.
   * However, all of this data is required when clamping the date
   * so that the correct initial value can be selected. As a result,
   * we need to fill in any omitted data with the min or max values.
   */

  const yearValue = year ?? todayParts.year;
  const monthValue = month ?? 12;
  return {
    month: monthValue,
    day: day ?? getNumDaysInMonth(monthValue, yearValue),
    /**
     * Passing in "HH:mm" is a valid ISO-8601
     * string, so we just default to the current year
     * in this case.
     */
    year: yearValue,
    hour: hour ?? 23,
    minute: minute ?? 59,
  };
};

/**
 * Takes a min date string and creates a DatetimeParts
 * object, filling in any missing information.
 * For example, min="2012" would fill in the missing
 * month, day, hour, and minute information.
 */
export const parseMinParts = (min: string, todayParts: DatetimeParts): DatetimeParts | undefined => {
  const result = parseDate(min);

  /**
   * If min was not a valid date then return undefined.
   */
  if (result === undefined) {
    return;
  }

  const { month, day, year, hour, minute } = result;

  /**
   * When passing in `max` or `min`, developers
   * can pass in any ISO-8601 string. This means
   * that not all of the date/time fields are defined.
   * For example, passing max="2012" is valid even though
   * there is no month, day, hour, or minute data.
   * However, all of this data is required when clamping the date
   * so that the correct initial value can be selected. As a result,
   * we need to fill in any omitted data with the min or max values.
   */
  return {
    month: month ?? 1,
    day: day ?? 1,
    /**
     * Passing in "HH:mm" is a valid ISO-8601
     * string, so we just default to the current year
     * in this case.
     */
    year: year ?? todayParts.year,
    hour: hour ?? 0,
    minute: minute ?? 0,
  };
};
