import { DatetimeParts } from '../datetime-interface';

import { isAfter, isBefore, isSameDay } from './comparison';
import { generateDayAriaLabel } from './format';

export const isYearDisabled = (refYear: number, minParts?: DatetimeParts, maxParts?: DatetimeParts) => {
  if (minParts && minParts.year > refYear) {
    return true;
  }

  if (maxParts && maxParts.year < refYear) {
    return true;
  }

  return false;
}

export const isMonthSwipeDisabled = (refMonth: number, refYear: number, workingParts?: DatetimeParts, minParts?: DatetimeParts, maxParts?: DatetimeParts) => {
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
    if (minParts.month) {
      // If the minimum parts contains a month, compare both the month and year
      if (refMonth < minParts.month && refYear <= minParts.year) {
        return true;
      }
      // Otherwise only compare the year range
    } else if (minParts.year && refYear < minParts.year) {
      return true;
    }
  }

  if (maxParts) {
    if (maxParts.month && refMonth > maxParts.month && refYear >= maxParts.year) {
      return true;
    } else if (maxParts.year && refYear > maxParts.year) {
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
 * Given a working date, an optional minimum date range,
 * and an optional maximum date range; determine if the
 * previous navigation button is disabled.
 */
export const isPrevMonthDisabled = (refParts: {
  month: number,
  year: number
}, minParts?: {
  month?: number,
  year: number
}, maxParts?: {
  month?: number,
  year: number
}) => {
  if (minParts) {
    if (minParts.month) {
      /**
       * Disables the previous month if the current date is either at the minimum
       * month or before the minimum range.
       *
       * i.e.:
       * - Ref: 09/2021
       * - Min: 10/2021
       */
      if (refParts.month <= minParts.month && refParts.year <= minParts.year) {
        return true;
      }
    } else if (minParts.year) {
      /**
       * The minimum range only includes a year. Compare that the current date's year
       * is either at the minimum year or before the minimum year.
       *
       * i.e:
       * - Ref: 2021
       * - Min: 2021
       */
      if (refParts.month === 1) {
        if (refParts.year <= minParts.year) {
          return true;
        }
      } else if (refParts.year < minParts.year) {
        return true;
      }
    }
  }
  if (maxParts) {
    if (maxParts.month) {
      /**
       * In situations where the current date is outside the bounds of the upper (max) range,
       * we need to check if the previous month would return the date range into the valid range.
       *
       * i.e.:
       * - Date: 12/16/2021
       * - Max: 10/2021
       * - Min: 09/2021
       *
       * If it does, we allow the previous button to navigate back one step, otherwise we lock
       * navigation and require they use the month/year selector.
       */
      if (refParts.month - 1 === 0) {
        // The reference month is in January, so we need to step back to December of the previous year.
        if (12 > maxParts.month && refParts.year - 1 === maxParts.year) {
          return true;
        }
      } else if (refParts.month - 1 > maxParts.month && refParts.year === maxParts.year) {
        // Otherwise we are comparing if the previous month in the same year is within
        // the maximum date range.
        return true;
      }
    }
  }
  return false;
}

/**
 * Given a working date and a maximum date range,
 * determine if the next navigation button is disabled.
 */
export const isNextMonthDisabled = (refParts: {
  month: number,
  year: number
}, maxParts?: {
  month?: number,
  year: number
}) => {
  if (maxParts) {
    if (maxParts.month && refParts.month >= maxParts.month && refParts.year >= maxParts.year) {
      return true;
    } else if (maxParts.year && refParts.year > maxParts.year) {
      return true;
    }
  }
  return false;
}
