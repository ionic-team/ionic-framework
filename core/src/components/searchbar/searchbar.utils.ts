/**
 * Check if the cancel button should never be shown.
 *
 * TODO: Remove this when the `true` and `false`
 * options are removed.
 */
export const isCancelButtonSetToNever = (showCancelButton: boolean | string): boolean => {
  return (
    showCancelButton === 'never' ||
    showCancelButton === 'false' ||
    showCancelButton === false
  );
};

/**
 * Check if the cancel button should be shown on focus.
 *
 * TODO: Remove this when the `true` and `false`
 * options are removed.
 */
export const isCancelButtonSetToFocus = (showCancelButton: boolean | string): boolean => {
  return (
    showCancelButton === 'focus' ||
    showCancelButton === 'true' ||
    showCancelButton === true ||
    showCancelButton === ''
  );
};
