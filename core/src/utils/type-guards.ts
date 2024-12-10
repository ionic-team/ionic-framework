/** 
 * Checks input for usable number. Not NaN and not Infinite.
 */
export const isSafeNumber = (input: unknown): input is number => {
  return typeof input === 'number' && !isNaN(input) && isFinite(input);
};
