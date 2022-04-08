import type { DatetimeParts } from '../datetime-interface';

const get12HourTime = (hour: number) => {
  return hour % 12 || 12;
};

const getFormattedAMPM = (ampm?: string) => {
  if (ampm === undefined) {
    return '';
  }

  return ampm.toUpperCase();
};

export const getFormattedTime = (refParts: DatetimeParts, use24Hour: boolean): string => {
  if (refParts.hour === undefined || refParts.minute === undefined) {
    return 'Invalid Time';
  }

  const hour = use24Hour ? getFormattedHour(refParts.hour, use24Hour) : get12HourTime(refParts.hour);
  const minute = addTimePadding(refParts.minute);

  if (use24Hour) {
    return `${hour}:${minute}`;
  }

  return `${hour}:${minute} ${getFormattedAMPM(refParts.ampm)}`;
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
   * If date is today, prepend "Today" so screen readers indicate
   * that the date is today.
   */
  const labelString = getLocalizedDateTime(locale, refParts, { weekday: 'long', month: 'long', day: 'numeric' });
  return today ? `Today, ${labelString}` : labelString;
};

/**
 * Gets the day of the week, month, and day
 * Used for the header in MD mode.
 */
export const getMonthAndDay = (locale: string, refParts: DatetimeParts) => {
  return getLocalizedDateTime(locale, refParts, { weekday: 'short', month: 'short', day: 'numeric' });
};

/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the month name and full year.
 * Example: May 2021
 */
export const getMonthAndYear = (locale: string, refParts: DatetimeParts) => {
  return getLocalizedDateTime(locale, refParts, { month: 'long', year: 'numeric' });
};

/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the short month, numeric day, and full year.
 * Example: Apr 22, 2021
 */
export const getMonthDayAndYear = (locale: string, refParts: DatetimeParts) => {
  return getLocalizedDateTime(locale, refParts, { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Wrapper function for Intl.DateTimeFormat.
 * Allows developers to apply an allowed format to DatetimeParts.
 * This function also has built in safeguards for older browser bugs
 * with Intl.DateTimeFormat. It is preferred to use this function than
 * Intl.DateTimeFormat directly when calling the `format` method.
 */
export const getLocalizedDateTime = (
  locale: string,
  refParts: DatetimeParts,
  options: Intl.DateTimeFormatOptions
): string => {
  const timeString = !!refParts.hour && !!refParts.minute ? `${refParts.hour}:${refParts.minute}` : '';
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year} ${timeString} GMT+0000`);
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(date);
};
