import { config } from '@global/config';

import { printIonWarning } from './logging';

/**
 * The supported screen breakpoint names, ordered from smallest to largest.
 *
 * The ordering is significant: responsive values are resolved by walking this
 * list and retaining the value from the largest breakpoint that matches.
 *
 * The names are part of the public API. Applications may customize the width
 * at which a breakpoint activates through `screenBreakpoints`, but they cannot
 * rename these breakpoints or add new ones.
 */
export const SCREEN_BREAKPOINT_NAMES = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
export type ScreenBreakpoint = (typeof SCREEN_BREAKPOINT_NAMES)[number];

/**
 * The width, in pixels, at which each screen breakpoint activates. Values are
 * always unitless numbers so they can be used both in a `min-width` media
 * query and in a direct comparison against a measured element width.
 */
export type ScreenBreakpoints = Record<ScreenBreakpoint, number>;

/**
 * The screen breakpoints used when an application does not override them.
 * These match the `$screen-breakpoints` Sass map used by the stylesheets.
 */
export const DEFAULT_SCREEN_BREAKPOINTS: Readonly<ScreenBreakpoints> = Object.freeze({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
});

/**
 * A responsive property value keyed by screen breakpoint.
 *
 * This must remain an interface with explicitly declared keys for Stencil's
 * generated component types:
 *
 * - Stencil inlines interfaces into generated property signatures, but does
 *   not preserve the equivalent shape reliably when expressed as a type alias.
 * - Mapped keys are omitted from generated property signatures, so the
 *   breakpoint keys must be declared explicitly.
 * - Components must reference this through a non-generic alias rather than a
 *   generic type that depends on a default type argument.
 *
 * Keeping the keys explicit also keeps this type synchronized with
 * `SCREEN_BREAKPOINT_NAMES`: indexing it with those names causes a compile-time
 * error if a breakpoint is added or renamed without updating this interface.
 */
export interface BreakpointMap<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}

/**
 * Check whether a value is a plain object.
 *
 * Arrays are excluded: they are objects, but never a valid breakpoint map or
 * `screenBreakpoints` config.
 *
 * @param value The value to check.
 * @return Whether the value is a plain object.
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * Check whether a value is one of the screen breakpoint names.
 *
 * @param value The value to check.
 * @return Whether the value is a screen breakpoint name.
 */
const isScreenBreakpoint = (value: unknown): value is ScreenBreakpoint => {
  return SCREEN_BREAKPOINT_NAMES.includes(value as ScreenBreakpoint);
};

/**
 * Check whether a value is a breakpoint map.
 *
 * Breakpoint maps are JavaScript properties rather than HTML attributes because
 * HTML attributes are always strings.
 *
 * @param value The value to check.
 * @return Whether the value is a breakpoint map.
 */
export const isBreakpointMap = <T = unknown>(value: unknown): value is BreakpointMap<T> => {
  return isPlainObject(value);
};

/**
 * Find the largest breakpoint satisfying the predicate.
 *
 * @param matches Whether the breakpoint applies.
 * @return The largest matching breakpoint, or `undefined` if none match.
 */
const lastMatchingBreakpoint = (matches: (breakpoint: ScreenBreakpoint) => boolean): ScreenBreakpoint | undefined => {
  let matched: ScreenBreakpoint | undefined;

  /**
   * The names are ordered smallest to largest, so keeping the last match
   * returns the largest breakpoint that applies.
   */
  for (const breakpoint of SCREEN_BREAKPOINT_NAMES) {
    if (matches(breakpoint)) {
      matched = breakpoint;
    }
  }

  return matched;
};

/**
 * Resolve a responsive value from a breakpoint map. When several breakpoints
 * match, the value from the largest one wins.
 *
 * @param breakpointMap The value for each breakpoint. Breakpoints left out are skipped.
 * @param matches Whether the breakpoint applies.
 * @return The resolved value, or `undefined` if no matching breakpoint has one.
 */
export const resolveBreakpointMap = <T>(
  breakpointMap: BreakpointMap<T>,
  matches: (breakpoint: ScreenBreakpoint) => boolean
): T | undefined => {
  const breakpoint = lastMatchingBreakpoint((name) => breakpointMap[name] !== undefined && matches(name));

  return breakpoint === undefined ? undefined : breakpointMap[breakpoint];
};

/**
 * Validate an application's `screenBreakpoints` config and merge it over the
 * defaults. Each breakpoint is validated on its own, so a single bad value
 * falls back to its default instead of discarding the whole override.
 *
 * @param configValue The raw `screenBreakpoints` value from the config.
 * @return The complete set of screen breakpoints to use.
 */
const resolveScreenBreakpoints = (configValue: unknown): ScreenBreakpoints => {
  if (configValue === undefined) {
    return { ...DEFAULT_SCREEN_BREAKPOINTS };
  }

  if (!isPlainObject(configValue)) {
    printIonWarning(
      `Invalid "screenBreakpoints" config (${JSON.stringify(
        configValue
      )}). Expected an object of breakpoint names to unitless pixel values (e.g. { md: 768 }). Falling back to the default screen breakpoints.`
    );
    return { ...DEFAULT_SCREEN_BREAKPOINTS };
  }

  const breakpoints = { ...DEFAULT_SCREEN_BREAKPOINTS };
  const unknownNames: string[] = [];

  for (const [name, value] of Object.entries(configValue)) {
    if (!isScreenBreakpoint(name)) {
      unknownNames.push(name);
      continue;
    }

    /**
     * Only unitless numbers are accepted. The value is used to build a
     * `min-width` media query and is also compared directly against measured
     * element widths, so a string such as `'768px'` cannot be used as-is.
     */
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      printIonWarning(
        `Invalid value for the "${name}" screen breakpoint (${JSON.stringify(
          value
        )}). Expected a non-negative number of pixels with no unit (e.g. 768, not "768px"). Falling back to the default value of ${
          DEFAULT_SCREEN_BREAKPOINTS[name]
        }.`
      );
      continue;
    }

    breakpoints[name] = value;
  }

  if (unknownNames.length > 0) {
    printIonWarning(
      `Unknown screen breakpoint name(s) in the "screenBreakpoints" config: ${unknownNames
        .map((name) => `"${name}"`)
        .join(
          ', '
        )}. Screen breakpoints cannot be renamed or added. The supported names are: ${SCREEN_BREAKPOINT_NAMES.join(
        ', '
      )}.`
    );
  }

  /**
   * Responsive resolution assumes breakpoint values increase from `xs` through
   * `xxl`, because `resolveBreakpointMap` keeps the last matching breakpoint.
   *
   * Keep the configured values even when they are out of order—the application
   * may have supplied them intentionally—but warn because responsive resolution
   * may not behave as expected.
   */
  const isAscending = SCREEN_BREAKPOINT_NAMES.every(
    (name, index) => index === 0 || breakpoints[name] >= breakpoints[SCREEN_BREAKPOINT_NAMES[index - 1]]
  );

  if (!isAscending) {
    printIonWarning(
      `The "screenBreakpoints" config is not in ascending order (${JSON.stringify(
        breakpoints
      )}). Screen breakpoints must increase from "xs" to "xxl" for responsive values to resolve correctly.`
    );
  }

  return breakpoints;
};

/**
 * The config value from which the cached breakpoints were resolved.
 *
 * Configuration is read lazily because components may render before
 * `initialize()` runs. The resolved breakpoints are cached so validation
 * warnings are emitted once for each config object rather than on every render.
 */
let lastConfigValue: unknown;
let cachedBreakpoints: Readonly<ScreenBreakpoints> | undefined;

/**
 * Get the screen breakpoints for the application, merging any
 * `screenBreakpoints` config over the defaults.
 *
 * Config is expected to be set once at startup. The resolved result is cached
 * per config object, so replacing the config object picks up the new values
 * but mutating the existing one in place does not.
 *
 * @return The width, in pixels, that each screen breakpoint activates at.
 */
export const getScreenBreakpoints = (): Readonly<ScreenBreakpoints> => {
  const configValue = config.get('screenBreakpoints');

  if (cachedBreakpoints !== undefined && configValue === lastConfigValue) {
    return cachedBreakpoints;
  }

  lastConfigValue = configValue;
  /**
   * The same object is handed to every caller, so freezing it keeps one of
   * them from moving a breakpoint for the whole page. `Readonly` alone would
   * only stop TypeScript callers.
   */
  cachedBreakpoints = Object.freeze(resolveScreenBreakpoints(configValue));

  return cachedBreakpoints;
};

/**
 * Get the width, in pixels, that a screen breakpoint activates at.
 *
 * @param breakpoint The name of the screen breakpoint.
 * @return The activation width, or `undefined` if the name is not a screen breakpoint.
 */
export const getScreenBreakpointValue = (breakpoint: unknown): number | undefined => {
  return isScreenBreakpoint(breakpoint) ? getScreenBreakpoints()[breakpoint] : undefined;
};

/**
 * Get the `min-width` media query that a screen breakpoint activates at.
 *
 * @param breakpoint The name of the screen breakpoint.
 * @return The media query, e.g. `(min-width: 768px)`, or `undefined` if the
 * name is not a screen breakpoint.
 */
export const getScreenBreakpointMediaQuery = (breakpoint: unknown): string | undefined => {
  const value = getScreenBreakpointValue(breakpoint);

  return value === undefined ? undefined : `(min-width: ${value}px)`;
};

/**
 * Reset the cached screen breakpoints.
 *
 * @internal Used by tests that change the config between assertions.
 */
export const resetScreenBreakpoints = () => {
  lastConfigValue = undefined;
  cachedBreakpoints = undefined;
};

/**
 * Check whether the window matches a screen breakpoint's `min-width` media
 * query, e.g. `matchBreakpoint('sm')` is `true` once the screen is at least as
 * wide as the `sm` breakpoint.
 *
 * @param breakpoint The name of the screen breakpoint. An empty or `undefined`
 * breakpoint always matches, so an unqualified responsive value applies at
 * every screen size.
 * @return Whether the breakpoint currently applies.
 */
export const matchBreakpoint = (breakpoint: string | undefined) => {
  if (breakpoint === undefined || breakpoint === '') {
    return true;
  }

  if ((window as any).matchMedia) {
    const mediaQuery = getScreenBreakpointMediaQuery(breakpoint);

    // Not one of the screen breakpoints, so it never matches
    if (mediaQuery === undefined) {
      return false;
    }

    return window.matchMedia(mediaQuery).matches;
  }

  return false;
};

/**
 * Get the largest screen breakpoint that currently matches.
 *
 * @return The active breakpoint, or `undefined` when none match. That happens
 * before hydration, or when `xs` is configured above the current screen width.
 * Components treat it as "no breakpoint reported" and fall back to their
 * build-time media queries.
 */
export const getActiveBreakpoint = (): ScreenBreakpoint | undefined => lastMatchingBreakpoint(matchBreakpoint);

/**
 * Subscribers notified when the active screen breakpoint changes, and the
 * `MediaQueryList` per breakpoint that drives them.
 *
 * Both are created on first subscribe rather than at module scope: a page can
 * hold hundreds of columns, so the listeners are shared, and importing this
 * module for the pure resolution helpers allocates nothing.
 */
let breakpointSubscribers: Set<() => void> | undefined;
let breakpointQueries: MediaQueryList[] | undefined;

/**
 * Notify every subscriber that the active breakpoint may have changed. The set
 * is absent until the first subscriber registers.
 */
const notifyBreakpointSubscribers = () => {
  breakpointSubscribers?.forEach((callback) => callback());
};

/**
 * Listen on the breakpoint media queries built from the configured widths.
 */
const createBreakpointQueries = () => {
  breakpointQueries = SCREEN_BREAKPOINT_NAMES.map((breakpoint) =>
    window.matchMedia(getScreenBreakpointMediaQuery(breakpoint)!)
  );

  breakpointQueries.forEach((query) => query.addEventListener('change', notifyBreakpointSubscribers));
};

/**
 * Stop listening on the current breakpoint media queries.
 */
const destroyBreakpointQueries = () => {
  breakpointQueries?.forEach((query) => query.removeEventListener('change', notifyBreakpointSubscribers));
  breakpointQueries = undefined;
};

/**
 * Subscribe to changes in the active screen breakpoint.
 *
 * Listening on the breakpoint media queries rather than on `resize` means the
 * callback fires only when a threshold is actually crossed, and at the same
 * moment the CSS media queries change rather than after a debounce.
 *
 * The queries are built from the configured widths on first subscribe, and
 * rebuilt by `refreshBreakpointListeners` if the config is ever reset again.
 *
 * @param callback Called when the active breakpoint changes.
 * @return A function that removes the subscription.
 */
export const onBreakpointChange = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined' || !(window as any).matchMedia) {
    return () => {};
  }

  if (breakpointQueries === undefined) {
    createBreakpointQueries();
  }

  breakpointSubscribers ??= new Set();
  breakpointSubscribers.add(callback);

  return () => {
    breakpointSubscribers?.delete(callback);
  };
};

/**
 * Rebuild the breakpoint media queries from the configured widths, keeping the
 * current subscribers.
 *
 * The queries are built on first subscribe, so they would otherwise keep the
 * widths that were configured then. Subscribers are notified because the
 * breakpoint they are on may have changed without the screen moving.
 *
 * @internal Called when the config is reset, since that is the only point the
 * widths can change.
 */
export const refreshBreakpointListeners = () => {
  if (breakpointQueries === undefined) {
    return;
  }

  destroyBreakpointQueries();
  createBreakpointQueries();

  notifyBreakpointSubscribers();
};

/**
 * Tear down the shared breakpoint listeners so the next subscribe rebuilds
 * them from the current config.
 *
 * @internal Used by tests that change the configured breakpoints, since the
 * media queries are built from them on first subscribe.
 */
export const resetBreakpointListeners = () => {
  destroyBreakpointQueries();
  breakpointSubscribers = undefined;
};
