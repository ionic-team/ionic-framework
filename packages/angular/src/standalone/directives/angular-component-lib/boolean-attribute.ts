/* eslint-disable */
/* tslint:disable */

/**
 * Transforms a value to a boolean so that boolean properties can be set by attribute presence,
 * e.g. `<my-component disabled>` instead of `<my-component [disabled]="true">`.
 *
 * Strings are coerced the same way Angular's `booleanAttribute` coerces them, so `''` (a bare
 * attribute) becomes `true` and `'false'` becomes `false`.
 *
 * Unlike Angular's `booleanAttribute`, `null` and `undefined` are passed through rather than
 * coerced to `false`. Components frequently treat them as a state distinct from `false`:
 *
 * ```tsx
 * // `undefined` means "decide based on the mode", which is not the same as `false`
 * const showDetail = detail !== undefined ? detail : mode === 'ios';
 *
 * // a strict comparison also behaves differently for `null` than it does for `false`
 * const showHandle = handle !== false;
 * ```
 *
 * Both values reach inputs routinely in Angular templates, from the `async` pipe before its
 * first emission and from form control values, so coercing them would change the behavior of
 * bindings that work today.
 *
 * This is implemented here rather than imported from `@angular/core` so that consumers on
 * Angular versions without `booleanAttribute` are unaffected by this file being generated.
 *
 * The parameter type is what Angular derives `ngAcceptInputType_*` from, so it decides which
 * template bindings compile. Widening it to `unknown` would let any expression through.
 *
 * Declared as a function rather than an arrow constant because Angular has to resolve input
 * transforms statically when compiling a library in partial compilation mode.
 *
 * This lives in its own file, separate from `utils.ts`, so that it carries no runtime imports.
 * That keeps it independently type-checkable without pulling `rxjs` in for `proxyOutputs`.
 */
export function nullableBooleanAttribute(value: boolean | string | null | undefined): boolean | null | undefined {
  if (value === null || value === undefined) {
    return value;
  }
  return typeof value === 'boolean' ? value : value !== 'false';
}
