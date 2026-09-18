/*
 * Duplicates `angular-component-lib/boolean-attribute.ts`, which the output
 * target copies next to each generated proxies file and so is not reachable
 * from here. `proxy.ts` duplicates `ProxyCmp` for the same reason. Refer to
 * the TODO at the top of `proxy.ts`.
 */

/**
 * Transforms a value to a boolean so that boolean properties can be set by attribute presence,
 * e.g. `<ion-modal handle>` instead of `<ion-modal [handle]="true">`.
 *
 * Strings are coerced the same way Angular's `booleanAttribute` coerces them, so `''` (a bare
 * attribute) becomes `true` and `'false'` becomes `false`.
 *
 * Unlike Angular's `booleanAttribute`, `null` and `undefined` are passed through rather than
 * coerced to `false`. Components frequently treat them as a state distinct from `false`, and both
 * reach inputs routinely from the `async` pipe before its first emission and from form control
 * values:
 *
 * ```tsx
 * // `undefined` means "decide based on the mode", which is not the same as `false`
 * const showDetail = detail !== undefined ? detail : mode === 'ios';
 *
 * // a strict comparison also behaves differently for `null` than it does for `false`
 * const showHandle = handle !== false;
 * ```
 *
 * Declared as a function rather than an arrow constant because Angular has to resolve input
 * transforms statically when compiling a library in partial compilation mode.
 */
export function nullableBooleanAttribute(value: boolean | string | null | undefined): boolean | null | undefined {
  if (value === null || value === undefined) {
    return value;
  }
  return typeof value === 'boolean' ? value : value !== 'false';
}
