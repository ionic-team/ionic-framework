import { Mode } from '../../../interface'
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

/**
 * Returns true if a given day should
 * not be interactive according to its value,
 * or the max/min dates.
 */
export const isDayDisabled = (refParts: DatetimeParts, minParts?: DatetimeParts, maxParts?: DatetimeParts) => {
  /**
   * If this is a filler date (i.e. padding)
   * then the date is disabled.
   */
  if (refParts.day === null) { return true; }

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

export const getCalendarYearState = (refYear: number, activeParts: DatetimeParts, todayParts: DatetimeParts, minParts?: DatetimeParts, maxParts?: DatetimeParts) => {
  const isActiveYear = refYear === activeParts.year;
  const isCurrentYear = refYear === todayParts.year;
  const disabled = isYearDisabled(refYear, minParts, maxParts);

  return {
    disabled,
    isActiveYear,
    isCurrentYear,
    ariaSelected: isActiveYear ? 'true' : null
  }
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
