import type { Mode } from '../../../interface';
import type { PickerColumnItem } from '../../picker-column-internal/picker-column-internal-interfaces';
import type { DatetimeParts } from '../datetime-interface';

import { isAfter, isBefore, isSameDay } from './comparison';
import { getFormattedHour, addTimePadding } from './format';
import { getNumDaysInMonth, is24Hour } from './helpers';
import { getNextMonth, getPreviousMonth, getInternalHourValue } from './manipulation';

/**
 * Returns the current date as
 * an ISO string in the user's
 * time zone.
 */
export const getToday = () => {
  /**
   * ion-datetime intentionally does not
   * parse time zones/do automatic time zone
   * conversion when accepting user input.
   * However when we get today's date string,
   * we want it formatted relative to the user's
   * time zone.
   *
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
  const date = new Date();
  const tzOffset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() - tzOffset);

  return date.toISOString();
};

const minutes = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
];
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
  const intl = new Intl.DateTimeFormat(locale, { weekday: weekdayFormat });
  const startDate = new Date('11/01/2020');
  const daysOfWeek = [];

  /**
   * For each day of the week,
   * get the day name.
   */
  for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    daysOfWeek.push(intl.format(currentDate));
  }

  return daysOfWeek;
};

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
  const offset =
    firstOfMonth >= firstDayOfWeek ? firstOfMonth - (firstDayOfWeek + 1) : 6 - (firstDayOfWeek - firstOfMonth);

  let days = [];
  for (let i = 1; i <= numDays; i++) {
    days.push({ day: i, dayOfWeek: (offset + i) % 7 });
  }

  for (let i = 0; i <= offset; i++) {
    days = [{ day: null, dayOfWeek: null }, ...days];
  }

  return days;
};

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
  const use24Hour = hourCycle === 'h23';
  let processedHours = use24Hour ? hour23 : hour12;
  let processedMinutes = minutes;
  let isAMAllowed = true;
  let isPMAllowed = true;

  if (hourValues) {
    processedHours = processedHours.filter((hour) => hourValues.includes(hour));
  }

  if (minuteValues) {
    processedMinutes = processedMinutes.filter((minute) => minuteValues.includes(minute));
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
        processedHours = processedHours.filter((hour) => {
          const convertedHour = refParts.ampm === 'pm' ? (hour + 12) % 24 : hour;
          return (use24Hour ? hour : convertedHour) >= minParts.hour!;
        });
        isAMAllowed = minParts.hour < 13;
      }
      if (minParts.minute !== undefined) {
        /**
         * The minimum minute range should not be enforced when
         * the hour is greater than the min hour.
         *
         * For example with a minimum range of 09:30, users
         * should be able to select 10:00-10:29 and beyond.
         */
        let isPastMinHour = false;
        if (minParts.hour !== undefined && refParts.hour !== undefined) {
          if (refParts.hour > minParts.hour) {
            isPastMinHour = true;
          }
        }

        processedMinutes = processedMinutes.filter((minute) => {
          if (isPastMinHour) {
            return true;
          }
          return minute >= minParts.minute!;
        });
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
        processedHours = processedHours.filter((hour) => {
          const convertedHour = refParts.ampm === 'pm' ? (hour + 12) % 24 : hour;
          return (use24Hour ? hour : convertedHour) <= maxParts.hour!;
        });
        isPMAllowed = maxParts.hour >= 13;
      }
      if (maxParts.minute !== undefined && refParts.hour === maxParts.hour) {
        // The available minutes should only be filtered when the hour is the same as the max hour.
        // For example if the max hour is 10:30 and the current hour is 10:00,
        // users should be able to select 00-30 minutes.
        // If the current hour is 09:00, users should be able to select 00-60 minutes.
        processedMinutes = processedMinutes.filter((minute) => minute <= maxParts.minute!);
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
    pm: isPMAllowed,
  };
};

/**
 * Given DatetimeParts, generate the previous,
 * current, and and next months.
 */
export const generateMonths = (refParts: DatetimeParts): DatetimeParts[] => {
  return [
    getPreviousMonth(refParts),
    { month: refParts.month, year: refParts.year, day: refParts.day },
    getNextMonth(refParts),
  ];
};

export const getMonthColumnData = (
  locale: string,
  refParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  monthValues?: number[]
): PickerColumnItem[] => {
  const { year } = refParts;
  const months = [];

  if (monthValues !== undefined) {
    let processedMonths = monthValues;
    if (maxParts?.month !== undefined) {
      processedMonths = processedMonths.filter((month) => month <= maxParts.month!);
    }
    if (minParts?.month !== undefined) {
      processedMonths = processedMonths.filter((month) => month >= minParts.month!);
    }

    processedMonths.forEach((processedMonth) => {
      const date = new Date(`${processedMonth}/1/${year} GMT+0000`);

      const monthString = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(date);
      months.push({ text: monthString, value: processedMonth });
    });
  } else {
    const maxMonth = maxParts && maxParts.year === year ? maxParts.month : 12;
    const minMonth = minParts && minParts.year === year ? minParts.month : 1;

    for (let i = minMonth; i <= maxMonth; i++) {
      /**
       *
       * There is a bug on iOS 14 where
       * Intl.DateTimeFormat takes into account
       * the local timezone offset when formatting dates.
       *
       * Forcing the timezone to 'UTC' fixes the issue. However,
       * we should keep this workaround as it is safer. In the event
       * this breaks in another browser, we will not be impacted
       * because all dates will be interpreted in UTC.
       *
       * Example:
       * new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date('Sat Apr 01 2006 00:00:00 GMT-0400 (EDT)')) // "March"
       * new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' }).format(new Date('Sat Apr 01 2006 00:00:00 GMT-0400 (EDT)')) // "April"
       *
       * In certain timezones, iOS 14 shows the wrong
       * date for .toUTCString(). To combat this, we
       * force all of the timezones to GMT+0000 (UTC).
       *
       * Example:
       * Time Zone: Central European Standard Time
       * new Date('1/1/1992').toUTCString() // "Tue, 31 Dec 1991 23:00:00 GMT"
       * new Date('1/1/1992 GMT+0000').toUTCString() // "Wed, 01 Jan 1992 00:00:00 GMT"
       */
      const date = new Date(`${i}/1/${year} GMT+0000`);

      const monthString = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(date);
      months.push({ text: monthString, value: i });
    }
  }

  return months;
};

/**
 * Returns information regarding
 * selectable dates (i.e 1st, 2nd, 3rd, etc)
 * within a reference month.
 * @param locale The locale to format the date with
 * @param refParts The reference month/year to generate dates for
 * @param minParts The minimum bound on the date that can be returned
 * @param maxParts The maximum bound on the date that can be returned
 * @param dayValues The allowed date values
 * @returns Date data to be used in ion-picker-column-internal
 */
export const getDayColumnData = (
  locale: string,
  refParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  dayValues?: number[]
): PickerColumnItem[] => {
  const { month, year } = refParts;
  const days = [];

  /**
   * If we have max/min bounds that in the same
   * month/year as the refParts, we should
   * use the define day as the max/min day.
   * Otherwise, fallback to the max/min days in a month.
   */
  const numDaysInMonth = getNumDaysInMonth(month, year);
  const maxDay = maxParts?.day && maxParts.year === year && maxParts.month === month ? maxParts.day : numDaysInMonth;
  const minDay = minParts?.day && minParts.year === year && minParts.month === month ? minParts.day : 1;

  if (dayValues !== undefined) {
    let processedDays = dayValues;
    processedDays = processedDays.filter((day) => day >= minDay && day <= maxDay);
    processedDays.forEach((processedDay) => {
      const date = new Date(`${month}/${processedDay}/${year} GMT+0000`);

      const dayString = new Intl.DateTimeFormat(locale, { day: 'numeric', timeZone: 'UTC' }).format(date);
      days.push({ text: dayString, value: processedDay });
    });
  } else {
    for (let i = minDay; i <= maxDay; i++) {
      const date = new Date(`${month}/${i}/${year} GMT+0000`);

      const dayString = new Intl.DateTimeFormat(locale, { day: 'numeric', timeZone: 'UTC' }).format(date);
      days.push({ text: dayString, value: i });
    }
  }

  return days;
};

export const getYearColumnData = (
  refParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  yearValues?: number[]
): PickerColumnItem[] => {
  let processedYears = [];
  if (yearValues !== undefined) {
    processedYears = yearValues;
    if (maxParts?.year !== undefined) {
      processedYears = processedYears.filter((year) => year <= maxParts.year!);
    }
    if (minParts?.year !== undefined) {
      processedYears = processedYears.filter((year) => year >= minParts.year!);
    }
  } else {
    const { year } = refParts;
    const maxYear = maxParts?.year || year;
    const minYear = minParts?.year || year - 100;

    for (let i = maxYear; i >= minYear; i--) {
      processedYears.push(i);
    }
  }

  return processedYears.map((year) => ({
    text: `${year}`,
    value: year,
  }));
};

export const getTimeColumnsData = (
  locale: string,
  refParts: DatetimeParts,
  hourCycle?: 'h23' | 'h12',
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  allowedHourValues?: number[],
  allowedMinuteVaues?: number[]
): { [key: string]: PickerColumnItem[] } => {
  const use24Hour = is24Hour(locale, hourCycle);
  const { hours, minutes, am, pm } = generateTime(
    refParts,
    use24Hour ? 'h23' : 'h12',
    minParts,
    maxParts,
    allowedHourValues,
    allowedMinuteVaues
  );

  const hoursItems = hours.map((hour) => {
    return {
      text: getFormattedHour(hour, use24Hour),
      value: getInternalHourValue(hour, use24Hour, refParts.ampm),
    };
  });
  const minutesItems = minutes.map((minute) => {
    return {
      text: addTimePadding(minute),
      value: minute,
    };
  });

  const ampmItems = [];
  if (am && !use24Hour) {
    ampmItems.push({
      text: 'AM',
      value: 'am',
    });
  }

  if (pm && !use24Hour) {
    ampmItems.push({
      text: 'PM',
      value: 'pm',
    });
  }

  return {
    minutesData: minutesItems,
    hoursData: hoursItems,
    ampmData: ampmItems,
  };
};
