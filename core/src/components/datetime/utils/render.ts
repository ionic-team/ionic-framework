import { getPickerMonths, getCalendarYears, generateTime } from './data';
import { getFormattedHour, addTimePadding } from './format';
import { getInternalHourValue } from './manipulation';

import type { DatetimeParts } from '../datetime-interface';
import { is24Hour } from './helpers';

/**
 * This file contains utils that assist in determining which
 * content to render inside of ion-datetime. In an effort to keep
 * the datetime.tsx file manageable, prefer putting complex rendering
 * logic in this file instead of inlining it in each render function
 * in datetime.tsx.
 */

/**
 * Creates and returns data necessary to properly
 * render the wheel picker in the renderMonth method.
 */
export const renderMonthPickerColumnData = (
  locale: string,
  refParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  allowedMonthValues?: number[]
) => {
  return getPickerMonths(locale, refParts, minParts, maxParts, allowedMonthValues);
}

export const renderYearPickerColumnData = (
  refParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  allowedYearValues?: number[]
) => {
  const years = getCalendarYears(refParts, minParts, maxParts, allowedYearValues);
  return years.map(year => (
    {
      text: `${year}`,
      value: year
    }
  ))
};

export const renderTimePickerColumnsData = (
  locale: string,
  refParts: DatetimeParts,
  hourCycle?: 'h23' | 'h12',
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  allowedHourValues?: number[],
  allowedMinuteVaues?: number[]
) => {
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
    ampmData: ampmItems
  }
}
