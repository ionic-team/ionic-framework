import type { DatetimeParts, DatetimeHourCycle } from '../datetime-interface';

import { is24Hour } from './helpers';
import { convertDataToISO } from './manipulation';

const getFormattedDayPeriod = (dayPeriod?: string) => {
  if (dayPeriod === undefined) {
    return '';
  }

  return dayPeriod.toUpperCase();
};

/**
 * Including time zone options may lead to the rendered text showing a
 * different time from what was selected in the Datetime, which could cause
 * confusion.
 */
const stripTimeZone = (formatOptions?: Intl.DateTimeFormatOptions): Intl.DateTimeFormatOptions | undefined => {
  if (!formatOptions) return formatOptions;

  /**
   * We do not want to display the time zone name
   */
  delete formatOptions.timeZoneName;

  /**
   * Setting the time zone to UTC ensures that the value shown is always the
   * same as what was selected and safeguards against older Safari bugs with
   * Intl.DateTimeFormat.
   */
  formatOptions.timeZone = 'UTC';

  return formatOptions;
};

export const getLocalizedTime = (
  locale: string,
  refParts: DatetimeParts,
  hourCycle: DatetimeHourCycle,
  formatOptions?: Intl.DateTimeFormatOptions
): string => {
  const timeParts: Pick<DatetimeParts, 'hour' | 'minute'> = {
    hour: refParts.hour,
    minute: refParts.minute,
  };

  if (timeParts.hour === undefined || timeParts.minute === undefined) {
    return 'Invalid Time';
  }

  const defaultFormatOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric' };

  /**
   * If any options are provided, don't use any of the defaults.
   */
  const options = stripTimeZone(formatOptions ?? defaultFormatOptions);

  return new Intl.DateTimeFormat(locale, {
    ...options,
    /**
     * We use hourCycle here instead of hour12 due to:
     * https://bugs.chromium.org/p/chromium/issues/detail?id=1347316&q=hour12&can=2
     */
    hourCycle,
  }).format(
    new Date(
      convertDataToISO({
        /**
         * JS uses a simplified ISO 8601 format which allows for
         * date-only formats and date-time formats, but not
         * time-only formats: https://tc39.es/ecma262/#sec-date-time-string-format
         * As a result, developers who only pass a time will get
         * an "Invalid Date" error. To account for this, we make sure that
         * year/day/month values are set when passing to new Date().
         * The Intl.DateTimeFormat call above only uses the hour/minute
         * values, so passing these date values should have no impact
         * on the time output.
         */
        year: 2023,
        day: 1,
        month: 1,
        ...timeParts,
      }) + 'Z'
    )
  );
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
 * Formats 24 hour times so that
 * it always has 2 digits. For
 * 12 hour times it ensures that
 * hour 0 is formatted as '12'.
 */
export const getFormattedHour = (hour: number, hourCycle: DatetimeHourCycle): string => {
  /**
   * Midnight for h11 starts at 0:00am
   * Midnight for h12 starts at 12:00am
   * Midnight for h23 starts at 00:00
   * Midnight for h24 starts at 24:00
   */
  if (hour === 0) {
    switch (hourCycle) {
      case 'h11':
        return '0';
      case 'h12':
        return '12';
      case 'h23':
        return '00';
      case 'h24':
        return '24';
      default:
        throw new Error(`Invalid hour cycle "${hourCycle}"`);
    }
  }

  const use24Hour = is24Hour(hourCycle);
  /**
   * h23 and h24 use 24 hour times.
   */
  if (use24Hour) {
    return addTimePadding(hour);
  }

  return hour.toString();
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
  const date = getNormalizedDate(refParts);

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
export const getMonthAndDay = (locale: string, refParts: DatetimeParts, formatOptions?: Intl.DateTimeFormatOptions) => {
  const defaultFormatOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

  // If any options are provided, don't use any of the defaults. This way the developer can (for example) choose to not have the weekday displayed at all.
  const options = stripTimeZone(formatOptions ?? defaultFormatOptions);

  const date = getNormalizedDate(refParts);
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the month name and full year.
 * Example: May 2021
 */
export const getMonthAndYear = (locale: string, refParts: DatetimeParts) => {
  const date = getNormalizedDate(refParts);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
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
 * Given a locale and a date object,
 * return a formatted string that includes
 * the numeric day.
 * Note: Some languages will add literal characters
 * to the end. This function removes those literals.
 * Example: 29
 */
export const getDay = (locale: string, refParts: DatetimeParts) => {
  return getLocalizedDateTimeParts(locale, refParts, { day: 'numeric' }).find((obj) => obj.type === 'day')!.value;
};

/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the numeric year.
 * Example: 2022
 */
export const getYear = (locale: string, refParts: DatetimeParts) => {
  return getLocalizedDateTime(locale, refParts, { year: 'numeric' });
};

/**
 * Given reference parts, return a JS Date object
 * with a normalized time.
 */
export const getNormalizedDate = (refParts: DatetimeParts) => {
  const timeString =
    refParts.hour !== undefined && refParts.minute !== undefined ? ` ${refParts.hour}:${refParts.minute}` : '';

  /**
   * We use / notation here for the date
   * so we do not need to do extra work and pad values with zeroes.
   * Values such as YYYY-MM are still valid, so
   * we add fallback values so we still get
   * a valid date otherwise we will pass in a string
   * like "//2023". Some browsers, such as Chrome, will
   * account for this and still return a valid date. However,
   * this is not a consistent behavior across all browsers.
   */
  return new Date(`${refParts.month ?? 1}/${refParts.day ?? 1}/${refParts.year ?? 2023}${timeString} GMT+0000`);
};

/**
 * Given a locale, DatetimeParts, and options
 * format the DatetimeParts according to the options
 * and locale combination. This returns a string. If
 * you want an array of the individual pieces
 * that make up the localized date string, use
 * getLocalizedDateTimeParts.
 */
export const getLocalizedDateTime = (
  locale: string,
  refParts: DatetimeParts,
  options: Intl.DateTimeFormatOptions
): string => {
  const date = getNormalizedDate(refParts);
  return getDateTimeFormat(locale, options).format(date);
};

/**
 * Given a locale, DatetimeParts, and options
 * format the DatetimeParts according to the options
 * and locale combination. This returns an array of
 * each piece of the date.
 */
export const getLocalizedDateTimeParts = (
  locale: string,
  refParts: DatetimeParts,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormatPart[] => {
  const date = getNormalizedDate(refParts);
  return getDateTimeFormat(locale, options).formatToParts(date);
};

/**
 * Wrapper function for Intl.DateTimeFormat.
 * Allows developers to apply an allowed format to DatetimeParts.
 * This function also has built in safeguards for older browser bugs
 * with Intl.DateTimeFormat.
 */
const getDateTimeFormat = (locale: string, options: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' });
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
