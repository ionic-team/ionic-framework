/**
 * Validation for CSS [length-percentage](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length-percentage)
 * types like `<length>` (`<number>` + unit identifier) or `<percentage>` (`<number>%`).
 * Also supports simple `calc` / `min` / `max` / `clamp(...)` forms.
 */

// Matches `<length>` (`<number>` + unit identifier) or `<percentage>` (`<number>%`).
const LENGTH_PERCENTAGE_PATTERN = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:%|[a-z]+)$/i;

// Matches simple `calc` / `min` / `max` / `clamp(...)` functions.
const MATH_FUNCTION_PATTERN = /^(calc|min|max|clamp)\s*\(.+\)$/i;

/**
 * Returns whether `value` matches the [length-percentage](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length-percentage)
 * syntax. Accepts `<length>` (`<number>` + unit identifier) or `<percentage>` (`<number>%`).
 * Also supports simple `calc` / `min` / `max` / `clamp(...)` forms.
 *
 * @param value String value to validate.
 */
export function isValidLengthPercentage(value: string): boolean {
  const v = value.trim();
  if (!v) {
    return false;
  }

  return MATH_FUNCTION_PATTERN.test(v) || LENGTH_PERCENTAGE_PATTERN.test(v);
}
