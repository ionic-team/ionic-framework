import { DatetimeHourCycle } from '../datetime-interface';

/**
 * Determines if given year is a
 * leap year. Returns `true` if year
 * is a leap year. Returns `false`
 * otherwise.
 */
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const is24Hour = (locale: string, hourCycle?: DatetimeHourCycle) => {
  /**
   * If developer has explicitly enabled h23 time
   * then return early and do not look at the system default.
   */
  if (hourCycle !== undefined) {
    return hourCycle === 'h23';
  }

  /**
   * If hourCycle was not specified, check the locale
   * that is set on the user's device. We first check the
   * Intl.DateTimeFormat hourCycle option as developers can encode this
   * option into the locale string. Example: `en-US-u-hc-h23`
   */
  const formatted = new Intl.DateTimeFormat(locale, { hour: 'numeric' });
  const options = formatted.resolvedOptions();
  if (options.hourCycle !== undefined) {
    return options.hourCycle === 'h23';
  }

  /**
   * If hourCycle is not specified (either through lack
   * of browser support or locale information) then fall
   * back to this slower hourCycle check.
   */
  const date = new Date('5/18/2021 00:00');
  const parts = formatted.formatToParts(date);
  const hour = parts.find((p) => p.type === 'hour');

  if (!hour) {
    throw new Error('Hour value not found from DateTimeFormat');
  }

  return hour.value === '00';
};

/**
 * Given a date object, returns the number
 * of days in that month.
 * Month value begin at 1, not 0.
 * i.e. January = month 1.
 */
export const getNumDaysInMonth = (month: number, year: number) => {
  return month === 4 || month === 6 || month === 9 || month === 11
    ? 30
    : month === 2
    ? isLeapYear(year)
      ? 29
      : 28
    : 31;
};

/**
 * Certain locales display month then year while
 * others display year then month.
 * We can use Intl.DateTimeFormat to determine
 * the ordering for each locale.
 * The formatOptions param can be used to customize
 * which pieces of a date to compare against the month
 * with. For example, some locales render dd/mm/yyyy
 * while others render mm/dd/yyyy. This function can be
 * used for variations of the same "month first" check.
 */
export const isMonthFirstLocale = (
  locale: string,
  formatOptions: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    year: 'numeric',
  }
) => {
  /**
   * By setting month and year we guarantee that only
   * month, year, and literal (slashes '/', for example)
   * values are included in the formatToParts results.
   *
   * The ordering of the parts will be determined by
   * the locale. So if the month is the first value,
   * then we know month should be shown first. If the
   * year is the first value, then we know year should be shown first.
   *
   * This ordering can be controlled by customizing the locale property.
   */
  const parts = new Intl.DateTimeFormat(locale, formatOptions).formatToParts(new Date());

  return parts[0].type === 'month';
};

/**
 * Determines if the given locale formats the day period (am/pm) to the
 * left or right of the hour.
 * @param locale The locale to check.
 * @returns `true` if the locale formats the day period to the left of the hour.
 */
export const isLocaleDayPeriodRTL = (locale: string) => {
  const parts = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).formatToParts(new Date());
  return parts[0].type === 'dayPeriod';
};
