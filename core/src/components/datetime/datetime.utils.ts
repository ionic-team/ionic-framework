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

// Partially stubbed
export const getDaysOfWeek = (mode: Mode) => {
  if (mode === 'ios') {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  } else {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }
}
