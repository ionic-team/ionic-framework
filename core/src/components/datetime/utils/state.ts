import type { DatetimeParts } from '../datetime-interface';

import { isAfter, isBefore, isSameDay } from './comparison';
import { generateDayAriaLabel } from './format';
import { getNextMonth, getPreviousMonth } from './manipulation';

export const isYearDisabled = (refYear: number, minParts?: DatetimeParts, maxParts?: DatetimeParts) => {
  if (minParts && minParts.year > refYear) {
    return true;
  }

  if (maxParts && maxParts.year < refYear) {
    return true;
  }

  return false;
};

/**
 * Returns true if a given day should
 * not be interactive according to its value,
 * or the max/min dates.
 */
export const isDayDisabled = (
  refParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  dayValues?: number[]
) => {
  /**
   * If this is a filler date (i.e. padding)
   * then the date is disabled.
   */
  if (refParts.day === null) {
    return true;
  }

  /**
   * If user passed in a list of acceptable day values
   * check to make sure that the date we are looking
   * at is in this array.
   */
  if (dayValues !== undefined && !dayValues.includes(refParts.day)) {
    return true;
  }

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
  if (minParts && isBefore(refParts, minParts)) {
    return true;
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
  if (maxParts && isAfter(refParts, maxParts)) {
    return true;
  }

  /**
   * If none of these checks
   * passed then the date should
   * be interactive.
   */
  return false;
};

/**
 * Given a locale, a date, the selected date(s), and today's date,
 * generate the state for a given calendar day button.
 */
export const getCalendarDayState = (
  locale: string,
  refParts: DatetimeParts,
  activeParts: DatetimeParts | DatetimeParts[],
  todayParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  dayValues?: number[]
) => {
  /**
   * activeParts signals what day(s) are currently selected in the datetime.
   * If multiple="true", this will be an array, but the logic in this util
   * is the same whether we have one selected day or many because we're only
   * calculating the state for one button. So, we treat a single activeParts value
   * the same as an array of length one.
   */
  const activePartsArray = Array.isArray(activeParts) ? activeParts : [activeParts];

  /**
   * The day button is active if it is selected, or in other words, if refParts
   * matches at least one selected date.
   */
  const isActive = activePartsArray.find((parts) => isSameDay(refParts, parts)) !== undefined;

  const isToday = isSameDay(refParts, todayParts);
  const disabled = isDayDisabled(refParts, minParts, maxParts, dayValues);

  /**
   * Note that we always return one object regardless of whether activeParts
   * was an array, since we pare down to one value for isActive.
   */
  return {
    disabled,
    isActive,
    isToday,
    ariaSelected: isActive ? 'true' : null,
    ariaLabel: generateDayAriaLabel(locale, isToday, refParts),
  };
};

/**
 * Returns `true` if the month is disabled given the
 * current date value and min/max date constraints.
 */
export const isMonthDisabled = (
  refParts: DatetimeParts,
  {
    minParts,
    maxParts,
  }: {
    minParts?: DatetimeParts;
    maxParts?: DatetimeParts;
  }
) => {
  // If the year is disabled then the month is disabled.
  if (isYearDisabled(refParts.year, minParts, maxParts)) {
    return true;
  }
  // If the date value is before the min date, then the month is disabled.
  // If the date value is after the max date, then the month is disabled.
  if ((minParts && isBefore(refParts, minParts)) || (maxParts && isAfter(refParts, maxParts))) {
    return true;
  }
  return false;
};

/**
 * Given a working date, an optional minimum date range,
 * and an optional maximum date range; determine if the
 * previous navigation button is disabled.
 */
export const isPrevMonthDisabled = (refParts: DatetimeParts, minParts?: DatetimeParts, maxParts?: DatetimeParts) => {
  const prevMonth = {
    ...getPreviousMonth(refParts),
    day: null,
  };
  return isMonthDisabled(prevMonth, {
    minParts,
    maxParts,
  });
};

/**
 * Given a working date and a maximum date range,
 * determine if the next navigation button is disabled.
 */
export const isNextMonthDisabled = (refParts: DatetimeParts, maxParts?: DatetimeParts) => {
  const nextMonth = {
    ...getNextMonth(refParts),
    day: null,
  };
  return isMonthDisabled(nextMonth, {
    maxParts,
  });
};
