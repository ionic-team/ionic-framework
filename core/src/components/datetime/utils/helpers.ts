/**
 * Typescript 4.x does not recognize hourCycle as a valid option.
 * See https://github.com/microsoft/TypeScript/issues/34399.
 */
interface DatetimeFormatOptions extends Intl.ResolvedDateTimeFormatOptions {
  hourCycle?: 'h11' | 'h12' | 'h23' | 'h24';
}

/**
 * Determines if given year is a
 * leap year. Returns `true` if year
 * is a leap year. Returns `false`
 * otherwise.
 */
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const is24Hour = (locale: string, hourCycle?: 'h23' | 'h12') => {
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
  const options = formatted.resolvedOptions() as DatetimeFormatOptions;
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
 */
export const isMonthFirstLocale = (locale: string) => {
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
  const parts = new Intl.DateTimeFormat(locale, { month: 'numeric', year: 'numeric' }).formatToParts(new Date());

  return parts[0].type === 'month';
};
