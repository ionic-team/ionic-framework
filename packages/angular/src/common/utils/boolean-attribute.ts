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
 * Angular's own `booleanAttribute` is not used because it coerces `null` and `undefined` to
 * `false`. Components frequently treat those as a state distinct from `false`, such as
 * `ion-item`'s `detail` resolving `undefined` to a computed default, and both reach inputs
 * routinely from the `async` pipe before its first emission and from form control values.
 *
 * The parameter type is what Angular derives `ngAcceptInputType_*` from, so it decides which
 * template bindings compile. Widening it to `unknown` would let any expression through.
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
