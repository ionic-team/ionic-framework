import type { DatetimeParts } from '../datetime-interface';

import { convertDataToISO } from './manipulation';

const getFormattedDayPeriod = (dayPeriod?: string) => {
  if (dayPeriod === undefined) {
    return '';
  }

  return dayPeriod.toUpperCase();
};

export const getLocalizedTime = (locale: string, refParts: DatetimeParts, use24Hour: boolean): string => {
  if (refParts.hour === undefined || refParts.minute === undefined) {
    return 'Invalid Time';
  }

  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC',
    hour12: !use24Hour,
  }).format(new Date(convertDataToISO(refParts)));
};

/**
 * Adds padding to a time value so
 * that it is always 2 digits.
 */
export const addTimePadding = (value: number): string => {
  const valueToString = value.toString();
  if (valueToString.length > 1) {
    return valueToString;
  }

  return `0${valueToString}`;
};

/**
 * Formats the hour value so that it
 * is always 2 digits. Only applies
 * if using 12 hour format.
 */
export const getFormattedHour = (hour: number, use24Hour: boolean): string => {
  if (!use24Hour) {
    return hour.toString();
  }

  return addTimePadding(hour);
};

/**
 * Generates an aria-label to be read by screen readers
 * given a local, a date, and whether or not that date is
 * today's date.
 */
export const generateDayAriaLabel = (locale: string, today: boolean, refParts: DatetimeParts) => {
  if (refParts.day === null) {
    return null;
  }

  /**
   * MM/DD/YYYY will return midnight in the user's timezone.
   */
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} GMT+0000`);

  const labelString = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);

  /**
   * If date is today, prepend "Today" so screen readers indicate
   * that the date is today.
   */
  return today ? `Today, ${labelString}` : labelString;
};

/**
 * Gets the day of the week, month, and day
 * Used for the header in MD mode.
 */
export const getMonthAndDay = (locale: string, refParts: DatetimeParts) => {
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} GMT+0000`);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(
    date
  );
};

/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the month name and full year.
 * Example: May 2021
 */
export const getMonthAndYear = (locale: string, refParts: DatetimeParts) => {
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} GMT+0000`);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
};

/**
 * Gets a localized version of "Today"
 * Falls back to "Today" in English for
 * browsers that do not support RelativeTimeFormat.
 */
export const getTodayLabel = (locale: string) => {
  if ('RelativeTimeFormat' in Intl) {
    const label = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day');
    return label.charAt(0).toUpperCase() + label.slice(1);
  } else {
    return 'Today';
  }
};

/**
 * When calling toISOString(), the browser
 * will convert the date to UTC time by either adding
 * or subtracting the time zone offset.
 * To work around this, we need to either add
 * or subtract the time zone offset to the Date
 * object prior to calling toISOString().
 * This allows us to get an ISO string
 * that is in the user's time zone.
 *
 * Example:
 * Time zone offset is 240
 * Meaning: The browser needs to add 240 minutes
 * to the Date object to get UTC time.
 * What Ionic does: We subtract 240 minutes
 * from the Date object. The browser then adds
 * 240 minutes in toISOString(). The result
 * is a time that is in the user's time zone
 * and not UTC.
 *
 * Note: Some timezones include minute adjustments
 * such as 30 or 45 minutes. This is why we use setMinutes
 * instead of setHours.
 * Example: India Standard Time
 * Timezone offset: -330 = -5.5 hours.
 *
 * List of timezones with 30 and 45 minute timezones:
 * https://www.timeanddate.com/time/time-zones-interesting.html
 */
export const removeDateTzOffset = (date: Date) => {
  const tzOffset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - tzOffset);
  return date;
};

const DATE_AM = removeDateTzOffset(new Date('2022T01:00'));
const DATE_PM = removeDateTzOffset(new Date('2022T13:00'));

/**
 * Formats the locale's string representation of the day period (am/pm) for a given
 * ref parts day period.
 *
 * @param locale The locale to format the day period in.
 * @param value The date string, in ISO format.
 * @returns The localized day period (am/pm) representation of the given value.
 */
export const getLocalizedDayPeriod = (locale: string, dayPeriod: 'am' | 'pm' | undefined) => {
  const date = dayPeriod === 'am' ? DATE_AM : DATE_PM;
  const localizedDayPeriod = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    timeZone: 'UTC',
  })
    .formatToParts(date)
    .find((part) => part.type === 'dayPeriod');

  if (localizedDayPeriod) {
    return localizedDayPeriod.value;
  }

  return getFormattedDayPeriod(dayPeriod);
};

/**
 * Formats the datetime's value to a string, for use in the native input.
 *
 * @param value The value to format, either an ISO string or an array thereof.
 */
export const formatValue = (value: string | string[] | null | undefined) => {
  return Array.isArray(value) ? value.join(',') : value;
};
