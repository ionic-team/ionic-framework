// TODO(FW-6886, FW-6892, FW-6891): Remove this file in favor of the Modular Ionic component config. Each overlay will be able to select its own defaults for label placement and justify based on the interface and mode, so this utility will no longer be necessary.

import type { Mode } from '../interface';

/**
 * Returns the default `labelPlacement` for a radio or checkbox option
 * rendered inside an overlay. Defaults follow each mode's established
 * option-row layout:
 * - `ios`: `"start"` for radio in `alert` and `popover`. The `modal`
 *   interface flips iOS radio back to `"end"`. Checkbox is always
 *   `"end"` on iOS.
 * - everything else (e.g. `md`): `"end"`.
 *
 * `interfaceType` is optional; only `"modal"` changes the result, so
 * callers that aren't a modal can omit it.
 *
 * Used by `select-popover` and `select-modal` as the fallback when an
 * option doesn't explicitly set `labelPlacement`.
 */
export const getOverlayLabelPlacement = (
  mode: Mode,
  control: 'radio' | 'checkbox',
  interfaceType?: 'alert' | 'popover' | 'modal'
): 'start' | 'end' => {
  if (mode === 'ios' && control === 'radio' && interfaceType !== 'modal') {
    return 'start';
  }

  return 'end';
};

/**
 * Returns the default `justify` for a radio or checkbox option rendered
 * inside an overlay. Defaults follow each mode's option-row layout:
 * - `ios`: `"space-between"` for radio in `alert` and `popover`. The
 *   `modal` interface falls back to `"start"`. Checkbox is always `"start"`
 *   on iOS.
 * - everything else (e.g. `md`): `"start"`.
 *
 * `interfaceType` is optional; only `"modal"` changes the result, so
 * callers that aren't a modal can omit it.
 *
 * Used by `select-popover` and `select-modal` as the fallback when an
 * option doesn't explicitly set `justify`.
 */
export const getOverlayLabelJustify = (
  mode: Mode,
  control: 'radio' | 'checkbox',
  interfaceType?: 'alert' | 'popover' | 'modal'
): 'start' | 'end' | 'space-between' => {
  if (mode === 'ios' && control === 'radio' && interfaceType !== 'modal') {
    return 'space-between';
  }

  return 'start';
};
