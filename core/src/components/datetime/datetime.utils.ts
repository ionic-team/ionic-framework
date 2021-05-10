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
