/**
 * Helpers for validating user-supplied CSS values using regular expressions, without
 * relying on browser CSS APIs.
 */

// Matches `<length>` (`<number>` + unit identifier) or `<percentage>` (`<number>%`).
const LENGTH_PERCENTAGE_PATTERN = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:%|[a-z]+)$/i;

// Matches simple `calc` / `min` / `max` / `clamp(...)` functions.
const MATH_FUNCTION_PATTERN = /^(calc|min|max|clamp)\s*\(.+\)$/i;

// Matches a `var(--name)` reference with an optional fallback, e.g.
// `var(--my-gap)` or `var(--my-gap, 16px)`.
const VAR_FUNCTION_PATTERN = /^var\(\s*--[^\s,)]+\s*(?:,[\s\S]*)?\)$/i;

/**
 * Returns whether `value` matches the [length-percentage](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length-percentage)
 * syntax. Accepts `<length>` (`<number>` + unit identifier) or `<percentage>` (`<number>%`).
 * Also supports simple `calc` / `min` / `max` / `clamp(...)` functions.
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

/**
 * Returns whether `value` is a single [`var()`](https://developer.mozilla.org/en-US/docs/Web/CSS/var)
 * reference, e.g. `var(--my-token)` or `var(--my-token, 16px)`. The referenced
 * custom property is resolved by the browser, so the resolved value is not
 * validated here.
 *
 * @param value String value to validate.
 */
export function isCssVariable(value: string): boolean {
  return VAR_FUNCTION_PATTERN.test(value.trim());
}
