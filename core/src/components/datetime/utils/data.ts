import { Mode } from '../../../interface';
import { DatetimeParts } from '../datetime-interface';

import {
  isAfter,
  isBefore,
  isSameDay
} from './comparison';
import {
  getNumDaysInMonth
} from './helpers';
import {
  getNextMonth,
  getPreviousMonth
} from './manipulation';

/**
 * Returns the current date as
 * an ISO string in the user's
 * timezone.
 */
export const getToday = () => {
  /**
   * Grab the current date object
   * as well as the timezone offset
   */
  const date = new Date();
  const tzOffset = date.getTimezoneOffset();

  /**
   * When converting to ISO string, everything is
   * set to UTC. Since we want to show these dates
   * relative to the user's timezone, we need to
   * subtract the timezone offset from the date
   * so that when `toISOString()` adds it back
   * there was a net change of zero hours from the
   * local date.
   */
  date.setHours(date.getHours() - (tzOffset / 60))
  return date.toISOString();
}

const minutes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
const hour12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const hour23 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

/**
 * Given a locale and a mode,
 * return an array with formatted days
 * of the week. iOS should display days
 * such as "Mon" or "Tue".
 * MD should display days such as "M"
 * or "T".
 */
export const getDaysOfWeek = (locale: string, mode: Mode, firstDayOfWeek = 0) => {
  /**
   * Nov 1st, 2020 starts on a Sunday.
   * ion-datetime assumes weeks start on Sunday,
   * but is configurable via `firstDayOfWeek`.
   */
  const weekdayFormat = mode === 'ios' ? 'short' : 'narrow';
  const intl = new Intl.DateTimeFormat(locale, { weekday: weekdayFormat })
  const startDate = new Date('11/01/2020');
  const daysOfWeek = [];

  /**
   * For each day of the week,
   * get the day name.
   */
  for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    daysOfWeek.push(intl.format(currentDate))
  }

  return daysOfWeek;
}

/**
 * Returns an array containing all of the
 * days in a month for a given year. Values are
 * aligned with a week calendar starting on
 * the firstDayOfWeek value (Sunday by default)
 * using null values.
 */
export const getDaysOfMonth = (month: number, year: number, firstDayOfWeek: number) => {
  const numDays = getNumDaysInMonth(month, year);
  const firstOfMonth = new Date(`${month}/1/${year}`).getDay();

  /**
   * To get the first day of the month aligned on the correct
   * day of the week, we need to determine how many "filler" days
   * to generate. These filler days as empty/disabled buttons
   * that fill the space of the days of the week before the first
   * of the month.
   *
   * There are two cases here:
   *
   * 1. If firstOfMonth = 4, firstDayOfWeek = 0 then the offset
   * is (4 - (0 + 1)) = 3. Since the offset loop goes from 0 to 3 inclusive,
   * this will generate 4 filler days (0, 1, 2, 3), and then day of week 4 will have
   * the first day of the month.
   *
   * 2. If firstOfMonth = 2, firstDayOfWeek = 4 then the offset
   * is (6 - (4 - 2)) = 4. Since the offset loop goes from 0 to 4 inclusive,
   * this will generate 5 filler days (0, 1, 2, 3, 4), and then day of week 5 will have
   * the first day of the month.
   */
  const offset = firstOfMonth >= firstDayOfWeek ? firstOfMonth - (firstDayOfWeek + 1) : 6 - (firstDayOfWeek - firstOfMonth);

  let days = [];
  for (let i = 1; i <= numDays; i++) {
    days.push({ day: i, dayOfWeek: (offset + i) % 7 });
  }

  for (let i = 0; i <= offset; i++) {
    days = [
      { day: null, dayOfWeek: null },
      ...days
    ]
  }

  return days;
}

/**
 * Given a local, reference datetime parts and option
 * max/min bound datetime parts, calculate the acceptable
 * hour and minute values according to the bounds and locale.
 */
export const generateTime = (
  refParts: DatetimeParts,
  hourCycle: 'h12' | 'h23' = 'h12',
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  hourValues?: number[],
  minuteValues?: number[]
) => {
  let processedHours = hourCycle === 'h23' ? hour23 : hour12;
  let processedMinutes = minutes;
  let isAMAllowed = true;
  let isPMAllowed = true;

  if (hourValues) {
    processedHours = processedHours.filter(hour => hourValues.includes(hour));
  }

  if (minuteValues) {
    processedMinutes = processedMinutes.filter(minute => minuteValues.includes(minute))
  }

  if (minParts) {

    /**
     * If ref day is the same as the
     * minimum allowed day, filter hour/minute
     * values according to min hour and minute.
     */
    if (isSameDay(refParts, minParts)) {
      /**
       * Users may not always set the hour/minute for
       * min value (i.e. 2021-06-02) so we should allow
       * all hours/minutes in that case.
       */
      if (minParts.hour !== undefined) {
        processedHours = processedHours.filter(hour => {
          const convertedHour = refParts.ampm === 'pm' ? (hour + 12) % 24 : hour;
          return convertedHour >= minParts.hour!;
        });
        isAMAllowed = minParts.hour < 13;
      }
      if (minParts.minute !== undefined) {
        processedMinutes = processedMinutes.filter(minute => minute >= minParts.minute!);
      }
    /**
     * If ref day is before minimum
     * day do not render any hours/minute values
     */
    } else if (isBefore(refParts, minParts)) {
      processedHours = [];
      processedMinutes = [];
      isAMAllowed = isPMAllowed = false;
    }
  }

  if (maxParts) {
    /**
     * If ref day is the same as the
     * maximum allowed day, filter hour/minute
     * values according to max hour and minute.
     */
    if (isSameDay(refParts, maxParts)) {
      /**
       * Users may not always set the hour/minute for
       * max value (i.e. 2021-06-02) so we should allow
       * all hours/minutes in that case.
       */
      if (maxParts.hour !== undefined) {
        processedHours = processedHours.filter(hour => {
          const convertedHour = refParts.ampm === 'pm' ? (hour + 12) % 24 : hour;
          return convertedHour <= maxParts.hour!;
        });
        isPMAllowed = maxParts.hour >= 13;
      }
      if (maxParts.minute !== undefined) {
        processedMinutes = processedMinutes.filter(minute => minute <= maxParts.minute!);
      }

    /**
     * If ref day is after minimum
     * day do not render any hours/minute values
     */
    } else if (isAfter(refParts, maxParts)) {
      processedHours = [];
      processedMinutes = [];
      isAMAllowed = isPMAllowed = false;
    }
  }

  return {
    hours: processedHours,
    minutes: processedMinutes,
    am: isAMAllowed,
    pm: isPMAllowed
  }
}

/**
 * Given DatetimeParts, generate the previous,
 * current, and and next months.
 */
export const generateMonths = (refParts: DatetimeParts): DatetimeParts[] => {
  return [
    getPreviousMonth(refParts),
    { month: refParts.month, year: refParts.year, day: refParts.day },
    getNextMonth(refParts)
  ]
}

export const getPickerMonths = (
  locale: string,
  refParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  monthValues?: number[]
) => {
  const { year } = refParts;
  const months = [];

  if (monthValues !== undefined) {
    let processedMonths = monthValues;
    if (maxParts?.month !== undefined) {
      processedMonths = processedMonths.filter(month => month <= maxParts.month!);
    }
    if (minParts?.month !== undefined) {
      processedMonths = processedMonths.filter(month => month >= minParts.month!);
    }

    processedMonths.forEach(processedMonth => {
      const date = new Date(`${processedMonth}/1/${year}`);

      const monthString = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
      months.push({ text: monthString, value: processedMonth });
    });
  } else {
    const maxMonth = maxParts && maxParts.year === year ? maxParts.month : 12;
    const minMonth = minParts && minParts.year === year ? minParts.month : 1;

    for (let i = minMonth; i <= maxMonth; i++) {
      const date = new Date(`${i}/1/${year}`);

      const monthString = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
      months.push({ text: monthString, value: i });
    }
  }

  return months;
}

export const getCalendarYears = (
  refParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  yearValues?: number[]
 ) => {
  if (yearValues !== undefined) {
    let processedYears = yearValues;
    if (maxParts?.year !== undefined) {
      processedYears = processedYears.filter(year => year <= maxParts.year!);
    }
    if (minParts?.year !== undefined) {
      processedYears = processedYears.filter(year => year >= minParts.year!);
    }
    return processedYears;
  } else {
    const { year } = refParts;
    const maxYear = (maxParts?.year || year);
    const minYear = (minParts?.year || year - 100);

    const years = [];
    for (let i = maxYear; i >= minYear; i--) {
      years.push(i);
    }

    return years;
  }
}
