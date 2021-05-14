import { Mode } from '../../interface';

interface DatetimeParts {
  month: number;
  day: number | null;
  year: number;
}

export const getPreviousWeek = (refParts: DatetimeParts): DatetimeParts => {
  const { month, day, year } = refParts;
  if (!day) {
    throw new Error('No day provided');
  }

  const workingParts = {
    month,
    day,
    year
  }

  workingParts.day = day - 7;

  /**
   * If wrapping to previous month
   * update days and decrement month
   */
  if (workingParts.day < 1) {
    workingParts.month -= 1;
  }

  /**
   * If moving to previous year, reset
   * month to December and decrement year
   */
  if (workingParts.month < 1) {
    workingParts.month = 12;
    workingParts.year -= 1;
  }

  /**
   * Determine how many days are in the current
   * month
   */

  if (workingParts.day < 1) {
    const daysInMonth = getNumDaysInMonth(workingParts.month, workingParts.year);

    /**
     * Take num days in month and add the
     * number of underflow days. This number will
     * be negative.
     * Example: 1 week before Jan 2, 2021 is
     * December 26, 2021 so:
     * 2 - 7 = -5
     * 31 + (-5) = 26
     */
    workingParts.day = daysInMonth + workingParts.day;
  }

  return workingParts;
}

export const getNextWeek = (refParts: DatetimeParts): DatetimeParts => {
  const { month, day, year } = refParts;
  if (!day) {
    throw new Error('No day provided');
  }

  const workingParts = {
    month,
    day,
    year
  }

  const daysInMonth = getNumDaysInMonth(month, year);
  workingParts.day = day + 7;

  /**
   * If wrapping to next month
   * update days and increment month
   */
  if (workingParts.day > daysInMonth) {
    workingParts.day -= daysInMonth;
    workingParts.month += 1;
  }

  /**
   * If moving to next year, reset
   * month to January and increment year
   */
  if (workingParts.month > 12) {
    workingParts.month = 1;
    workingParts.year += 1;
  }

  return workingParts;
}

export const getPartsFromCalendarDay = (el: HTMLElement): DatetimeParts => {
  return {
    month: parseInt(el.getAttribute('data-month')!),
    day: parseInt(el.getAttribute('data-day')!),
    year: parseInt(el.getAttribute('data-year')!),
  }
}

const ISO_8601_REGEXP = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;
const TIME_REGEXP = /^((\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/;

/**
 * Given an ISO-8601 string, format out the parts
 * We do not use the JS Date object here because
 * it adjusts the date for the current timezone.
 */
export const parseDate = (val: string | undefined | null): any | undefined => {
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

  return {
    year: parse[1],
    month: parse[2],
    day: parse[3],
    hour: parse[4],
    minute: parse[5],
    second: parse[6],
    millisecond: parse[7],
    tzOffset,
  };
};

/**
 * Given DatetimeParts, generate the previous month.
 */
export const getPreviousMonth = (refParts: DatetimeParts) => {
  /**
   * If current month is January, wrap backwards
   *  to December of the previous year.
   */
  const month = (refParts.month === 1) ? 12 : refParts.month - 1;
  const year = (refParts.month === 1) ? refParts.year - 1 : refParts.year;

  return { month, year, day: null };
}

/**
 * Given DatetimeParts, generate the next month.
 */
export const getNextMonth = (refParts: DatetimeParts) => {
  /**
   * If current month is December, wrap forwards
   *  to January of the next year.
   */
  const month = (refParts.month === 12) ? 1 : refParts.month + 1;
  const year = (refParts.month === 12) ? refParts.year + 1 : refParts.year;

  return { month, year, day: null };
}

/**
 * Given DatetimeParts, generate the previous,
 * current, and and next months.
 * Only intended to be used for generate month data in the
 * calendar. As a result, day value is not included.
 */
export const generateMonths = (refParts: DatetimeParts): DatetimeParts[] => {
  return [
    getPreviousMonth(refParts),
    { month: refParts.month, year: refParts.year, day: null },
    getNextMonth(refParts)
  ]
}

/**
 * Determines whether or not to render the
 * clock/calendar toggle icon as well as the
 * keyboard input icon.
 */
export const shouldRenderViewButtons = (mode: Mode) => {
  /**
   * Toggle icons are for MD only
   */
  return mode === 'md';
}

export const shouldRenderViewFooter = (mode: Mode, presentationType: 'modal' | 'popover' | 'inline' = 'inline', hasSlottedButtons = false) => {

  /**
   * If users has passed in custom buttons,
   * we should always show them,
   */
  if (hasSlottedButtons) { return true; }

  /**
   * Always show the footer for MD mode
   * since we need to show the time switch button
   */
  if (mode === 'md') { return true; }

  /**
   * If being used inline on iOS, we only
   * need to show default buttons if being used
   * in a modal.
   */
  if (presentationType === 'inline' || presentationType === 'popover') {
    return false;
  }

  return true;
}

/**
 * Datetime header is only rendered under
 * the following circumstances:
 * 1. User has slotted in their own title.
 * 2. App is in MD mode and datetime is
 * displayed inline or in a modal.
 */
export const shouldRenderViewHeader = (mode: Mode, presentationType: 'modal' | 'popover' | 'inline' = 'inline', hasSlottedTitle = false) => {
  /**
   * If user has passed in a title,
   * we should always show it.
   */
  if (hasSlottedTitle) { return true; }

  /**
   * iOS does not show a default title
   */
  if (mode === 'ios') { return false; }

  /**
   * The header is not displayed
   * when used as a popover.
   */
  if (presentationType === 'popover') {
    return false;
  }

  return true;
}

/**
 * Given a date object, returns the number
 * of days in that month.
 * Month value begin at 1, not 0.
 * i.e. January = month 1.
 */
export const getNumDaysInMonth = (month: number, year: number) => {
  return (month === 4 || month === 6 || month === 9 || month === 11) ? 30 : (month === 2) ? isLeapYear(year) ? 29 : 28 : 31;
}

/**
 * Determines if given year is a
 * leap year. Returns `true` if year
 * is a leap year. Returns `false`
 * otherwise.
 */
const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Returns an array containing all of the
 * days in a month for a given year. Values are
 * aligned with a week calendar starting on
 * Sunday using null values.
 */
export const getDaysOfMonth = (month: number, year: number) => {
  const numDays = getNumDaysInMonth(month, year);
  const offset = new Date(`${month}/1/${year}`).getDay();

  let days = [];
  for (let i = 1; i <= numDays; i++) {
    days.push(i);
  }

  for (let i = 0; i < offset; i++) {
    days = [
      null,
      ...days
    ]
  }

  return days;
}

/**
 * Gets the day of the week, month, and day
 * Used for the header in MD mode.
 */
export const getMonthAndDay = (locale: string, refParts: DatetimeParts) => {
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year}`);
  return new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the month name and full year.
 * Example: May 2021
 */
export const getMonthAndYear = (locale: string, refParts: DatetimeParts) => {
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year}`);
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
}

/**
 * Given a locale and a mode,
 * return an array with formatted days
 * of the week. iOS should display days
 * such as "Mon" or "Tue".
 * MD should display days such as "M"
 * or "T".
 */
export const getDaysOfWeek = (locale: string, mode: Mode) => {
  /**
   * Nov 1st, 2020 starts on a Sunday.
   * ion-datetime assumes weeks start
   * on Sunday.
   */
  const weekdayFormat = mode === 'ios' ? 'short' : 'narrow';
  const intl = new Intl.DateTimeFormat(locale, { weekday: weekdayFormat })
  const startDate = new Date('11/01/2020');
  const daysOfWeek = [];

  /**
   * For each day of the week,
   * get the day name.
   */
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    daysOfWeek.push(intl.format(currentDate))
  }

  return daysOfWeek;
}

/**
 * Returns true if the selected day is equal to the reference day
 */
export const isSameDay = (baseParts: DatetimeParts, compareParts: DatetimeParts) => {
  return (
    baseParts.month === compareParts.month &&
    baseParts.day === compareParts.day &&
    baseParts.year === compareParts.year
  );
}

/**
 * Returns true if a given day should
 * not be interactive according to its value,
 * or the max/min dates.
 */
export const isDayDisabled = (refParts: DatetimeParts, minParts?: DatetimeParts, maxParts?: DatetimeParts) => {
  const { day, month, year } = refParts;

  /**
   * If this is a filler date (i.e. padding)
   * then the date is disabled.
   */
  if (day === null) { return true; }

  /**
   * Given a min date, perform the following
   * checks. If any of them are true, then the
   * day should be disabled:
   * 1. Is the current year < the min allowed year?
   * 2. Is the current year === min allowed year,
   * but the current month < the min allowed month?
   * 3. Is the current year === min allowed year, the
   * current month === min allow month, but the current
   * day < the min allowed day?
   */
  if (minParts) {
    if (
      year < minParts.year ||
      year === minParts.year && month < minParts.month ||
      year === minParts.year && month === minParts.month && day < minParts.day!
    ) {
      return true;
    }
  }

  /**
   * Given a max date, perform the following
   * checks. If any of them are true, then the
   * day should be disabled:
   * 1. Is the current year > the max allowed year?
   * 2. Is the current year === max allowed year,
   * but the current month > the max allowed month?
   * 3. Is the current year === max allowed year, the
   * current month === max allow month, but the current
   * day > the max allowed day?
   */
  if (maxParts) {
    if (
      year > maxParts.year ||
      year === maxParts.year && month > maxParts.month ||
      year === maxParts.year && month === maxParts.month && day > maxParts.day!
    ) {
      return true;
    }
  }

  /**
   * If none of these checks
   * passed then the date should
   * be interactive.
   */
  return false;
}

/**
 * Given a locale, a date, the selected date, and today's date,
 * generate the state for a given calendar day button.
 */
export const getCalendarDayState = (locale: string, refParts: DatetimeParts, activeParts: DatetimeParts, todayParts: DatetimeParts, minParts?: DatetimeParts, maxParts?: DatetimeParts) => {
  const isActive = isSameDay(refParts, activeParts);
  const isToday = isSameDay(refParts, todayParts);
  const disabled = isDayDisabled(refParts, minParts, maxParts);

  return {
    disabled,
    isActive,
    isToday,
    ariaSelected: isActive ? 'true' : null,
    ariaLabel: generateDayAriaLabel(locale, isToday, refParts)
  }
}

/**
 * Generates an aria-label to be read by screen readers
 * given a local, a date, and whether or not that date is
 * today's date.
 */
export const generateDayAriaLabel = (locale: string, today: boolean, refParts: DatetimeParts) => {
  if (refParts.day === null) { return null; }

  /**
   * MM/DD/YYYY will return midnight in the user's timezone.
   */
  const date = new Date(`${refParts.month}/${refParts.day}/${refParts.year}`);

  const labelString = new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(date);

  /**
   * If date is today, prepend "Today" so screen readers indicate
   * that the date is today.
   */
  return (today) ? `Today, ${labelString}` : labelString;

}
