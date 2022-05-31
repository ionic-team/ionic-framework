import { getPickerMonths, getCalendarYears } from './data';
import type { DatetimeParts } from '../datetime-interface';

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
  workingParts: DatetimeParts,
  minParts?: DatetimeParts,
  maxParts?: DatetimeParts,
  allowedMonthValues?: number[]
) => {
  return getPickerMonths(locale, workingParts, minParts, maxParts, allowedMonthValues);
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
