import { Mode } from '../../interface';

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
 * Gets the day of the week, month, and day
 * Used for the header in MD mode.
 */
export const getMonthAndDay = (locale: string, date: Date = new Date()) => {
  return new Intl.DateTimeFormat(locale, { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

/**
 * Given a locale and a date object,
 * return a formatted string that includes
 * the month name and full year.
 * Example: May 2021
 */
export const getMonthAndYear = (locale: string, date: Date = new Date()) => {
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
