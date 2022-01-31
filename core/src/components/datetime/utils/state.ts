import { DatetimeParts } from '../datetime-interface';

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
}

export const isMonthSwipeDisabled = (
  refMonth: number,
  refYear: number,
  workingParts?: DatetimeParts,
  minParts?: { month?: number, year: number },
  maxParts?: { month?: number, year: number }) => {
  if (workingParts && refMonth === workingParts.month && refYear === workingParts.year) {
    /**
     * Do not disable the working month, if it's the current month being rendered.
     *
     * If the working month is disabled, scroll snap will not clip to the month
     * and will scroll the user to the first "enabled" calendar month.
     */
    return false;
  }

  if (minParts) {
    if (typeof minParts.month !== 'undefined') {
      // If the minimum parts contains a month, compare both the month and year
      if (refMonth < minParts.month && refYear <= minParts.year) {
        return true;
      }
      // Otherwise only compare the year range
    } else if (refYear < minParts.year) {
      return true;
    }
  }

  if (maxParts) {
    if (typeof maxParts.month !== 'undefined' && refMonth > maxParts.month && refYear >= maxParts.year) {
      return true;
    } else if (refYear > maxParts.year) {
      return true;
    }
  }

  return false;
}

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
  if (refParts.day === null) { return true; }

  /**
   * If user passed in a list of acceptable day values
   * check to make sure that the date we are looking
   * at is in this array.
   */
  if (dayValues !== undefined && !dayValues.includes(refParts.day)) { return true; }

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
}

/**
 * Given a locale, a date, the selected date, and today's date,
 * generate the state for a given calendar day button.
 */
export const getCalendarDayState = (
  locale: string,
  refParts: DatetimeParts,
  activeParts: DatetimeParts,
  todayParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  dayValues?: number[]
) => {
  const isActive = isSameDay(refParts, activeParts);
  const isToday = isSameDay(refParts, todayParts);
  const disabled = isDayDisabled(refParts, minParts, maxParts, dayValues);

  return {
    disabled,
    isActive,
    isToday,
    ariaSelected: isActive ? 'true' : null,
    ariaLabel: generateDayAriaLabel(locale, isToday, refParts)
  }
}

/**
 * Returns `true` if the month is disabled given the
 * current date value and min/max date constraints.
 */
export const isMonthDisabled = (refParts: { month: number, year: number }, { minParts, maxParts }: {
  minParts?: { month?: number, year: number },
  maxParts?: {
    month?: number, year: number
  }
}) => {
  // If the min date is set and the year is less than the min year.
  if (minParts && minParts.year > refParts.year) {
    return true;
  }
  // If the max date is set and the year is greater than the max year.
  if (maxParts && maxParts.year < refParts.year) {
    return true;
  }
  // If the min date is set and the year is the same as the min year,
  // but the month is less than the min month.
  if (minParts && minParts.year === refParts.year && minParts.month !== undefined && minParts.month > refParts.month) {
    return true;
  }
  // If the max date is set and the year is the same as the max year,
  // but the month is greater than the max month.
  if (maxParts && maxParts.year === refParts.year && maxParts.month !== undefined && maxParts.month < refParts.month) {
    return true;
  }

  return false;
}

/**
 * Given a working date, an optional minimum date range,
 * and an optional maximum date range; determine if the
 * previous navigation button is disabled.
 */
export const isPrevMonthDisabled = (
  refParts: {
    month: number,
    year: number,
    day: number | null
  },
  minParts?: {
    month?: number,
    year: number
  },
  maxParts?: {
    month?: number,
    year: number
  }) => {
  const prevMonth = getPreviousMonth(refParts);
  return isMonthDisabled(prevMonth, {
    minParts,
    maxParts
  });
}

/**
 * Given a working date and a maximum date range,
 * determine if the next navigation button is disabled.
 */
export const isNextMonthDisabled = (
  refParts: {
    month: number,
    year: number,
    day: number | null
  },
  maxParts?: {
    month?: number,
    year: number
  }) => {
  const nextMonth = getNextMonth(refParts);
  return isMonthDisabled(nextMonth, {
    maxParts
  });
}
