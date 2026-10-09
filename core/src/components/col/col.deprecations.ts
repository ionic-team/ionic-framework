// TODO(FW-7557): Remove this file in v11, along with the deprecated
// properties it supports and the calls to it in `col.tsx`.

import { isBreakpointMap } from '@utils/breakpoints';
import { printIonWarning } from '@utils/logging';

import type { Col } from './col';
import type { IonColBreakpointValues, IonColProperty } from './col.interface';
import { ION_COL_PROPERTIES } from './col.interface';

/**
 * The breakpoints the deprecated suffixed properties (e.g. `size-md`) cover.
 * `xxl` is absent by design: it is only reachable through the breakpoint object
 * form, so no new suffixed properties are introduced for it.
 */
const LEGACY_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/**
 * Deprecation warnings are tracked for the page rather than per column. Most
 * applications use the deprecated properties on every column in a grid, so
 * warning per instance floods the console with the same message.
 *
 * Messages are tracked rather than a single flag, so columns using different
 * properties each still report which ones they use.
 */
const printedWarnings = new Set<string>();

/**
 * Print a deprecation warning the first time it is seen.
 *
 * @param message The warning to print.
 * @param el The column the warning refers to.
 */
const warnOnce = (message: string, el: HTMLElement) => {
  if (printedWarnings.has(message)) {
    return;
  }

  printedWarnings.add(message);

  printIonWarning(message, el);
};

/**
 * Render a breakpoint object the way it would be written in code, so the
 * deprecation warning can show the exact replacement.
 *
 * @param values The breakpoint values to render.
 * @return The object as it would be written in JavaScript.
 */
const formatBreakpointValues = (values: IonColBreakpointValues): string => {
  const entries = Object.entries(values).map(([breakpoint, value]) => {
    const literal = typeof value === 'string' && /^\d+$/.test(value) ? value : JSON.stringify(value);

    return `${breakpoint}: ${literal}`;
  });

  return `{ ${entries.join(', ')} }`;
};

/**
 * Collect the values set through the deprecated suffixed properties (e.g.
 * `size-md`) into a breakpoint object.
 *
 * @param col The column to read the properties from.
 * @param property The responsive property to collect values for.
 * @return The values keyed by breakpoint.
 */
export const getLegacyBreakpointValues = (col: Col, property: IonColProperty): IonColBreakpointValues => {
  const values: IonColBreakpointValues = {};

  for (const breakpoint of LEGACY_BREAKPOINTS) {
    const suffixed = `${property}${breakpoint.charAt(0).toUpperCase()}${breakpoint.slice(1)}` as keyof Col;
    const value = col[suffixed] as string | undefined;

    if (value !== undefined) {
      values[breakpoint] = value;
    }
  }

  return values;
};

/**
 * Warn that the suffixed properties set on a column are deprecated, showing
 * the breakpoint object that replaces them, or that they are being ignored
 * because the unsuffixed property is set to an object.
 *
 * @param col The column to check.
 * @param el The column element the warning refers to.
 */
export const warnDeprecatedBreakpointProps = (col: Col, el: HTMLElement) => {
  for (const property of ION_COL_PROPERTIES) {
    const legacyValues = getLegacyBreakpointValues(col, property);
    const breakpoints = Object.keys(legacyValues);

    if (breakpoints.length === 0) {
      continue;
    }

    const names = breakpoints.map((breakpoint) => `${property}-${breakpoint}`);
    const subject = `The ${names.join(', ')} ${names.length === 1 ? 'property is' : 'properties are'}`;

    if (isBreakpointMap(col[property])) {
      warnOnce(
        `[ion-col] - ${subject} ignored because "${property}" is set to an object of screen breakpoint values, which takes precedence.`,
        el
      );

      continue;
    }

    /**
     * Build the equivalent object from the values actually set, so the example
     * is the replacement for this column rather than a generic one. The
     * unsuffixed value applies from the smallest screen up, so it becomes the
     * `xs` entry.
     */
    const base = col[property];
    const equivalent: IonColBreakpointValues = {
      ...(typeof base === 'string' || typeof base === 'number' ? { xs: base } : {}),
      ...legacyValues,
    };

    warnOnce(
      `[ion-col] - ${subject} deprecated. Set "${property}" to an object of screen breakpoint values instead (e.g. col.${property} = ${formatBreakpointValues(
        equivalent
      )}).`,
      el
    );
  }
};

/**
 * Warn that the `push` and `pull` properties no longer do anything.
 *
 * @param col The column to check.
 * @param el The column element the warning refers to.
 */
export const warnDeprecatedPushPullProps = (col: Col, el: HTMLElement) => {
  if (
    col.pull ||
    col.pullLg ||
    col.pullMd ||
    col.pullSm ||
    col.pullXl ||
    col.pullXs ||
    col.push ||
    col.pushLg ||
    col.pushMd ||
    col.pushSm ||
    col.pushXl ||
    col.pushXs
  ) {
    warnOnce(
      '[ion-col] - The pull and push properties are deprecated and no longer work, in favor of the order and size properties.',
      el
    );
  }
};

/**
 * Forget which warnings have been printed. Only needed by tests, since the
 * page would otherwise carry them between cases.
 */
export const resetColDeprecationWarnings = () => printedWarnings.clear();
