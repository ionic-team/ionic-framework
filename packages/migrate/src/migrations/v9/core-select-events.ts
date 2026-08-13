import type { Finding, Migration } from '../../types.js';
import { findOpeningTags, lineAt } from '../../ast/markup.js';
import { SOURCE_GLOBS, TEMPLATE_GLOBS } from '../../ast/text-scan.js';
import { V9_DOCS } from './docs.js';

/**
 * Two `ion-select` changes that fail silently:
 *
 *   - `ionChange` now fires only on an actual change. The `alert` and
 *     `action-sheet` interfaces used to emit on every confirmation, so a handler
 *     doing work on re-confirmation of the same value stops running.
 *   - The `action-sheet` interface no longer assigns the `selected` role, so
 *     code reading that role off `ionActionSheetDidDismiss` now sees
 *     `undefined`.
 *
 * Scoped to `ion-select` itself, so `ionChange` on the many other components
 * that emit it is not reported. Report-only: only the handler's body says
 * whether it depended on the old firing pattern.
 *
 * See https://ionicframework.com/docs/updating/9-0#select
 */
const SELECT_TAGS = ['ion-select', 'IonSelect'];
/** An `ionChange` binding in any dialect: `(ionChange)`, `@ionChange`, `onIonChange`, `v-on:ionChange`. */
const ION_CHANGE = /\bon-?ionChange\b|\bionChange\b/i;
/** A select anywhere in the file, in either spelling. */
const SELECT_MENTIONED = /\bion-select\b|\bIonSelect\b/;

const CHANGE_DETAIL =
  'ionChange only fires when the value actually changes now, not on every overlay confirm';
const ROLE_DETAIL =
  "the action sheet no longer dismisses with role 'selected'. Listen for ion-select's ionChange instead";

export const coreSelectEvents: Migration = {
  id: 'core-select-events',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#select',

  detect(ctx) {
    const findings: Finding[] = [];

    for (const filePath of ctx.glob(TEMPLATE_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      for (const tag of findOpeningTags(text, SELECT_TAGS)) {
        if (ION_CHANGE.test(tag.text)) {
          findings.push({
            filePath,
            line: lineAt(text, tag.start),
            detail: CHANGE_DETAIL,
            docsUrl: `${V9_DOCS}#ionchange-only-fires-when-the-value-changes`,
          });
        }
      }
    }

    // Only `ion-select`'s own action sheet lost the role, so this is gated on
    // the file mentioning a select.
    for (const filePath of ctx.glob(SOURCE_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined || !SELECT_MENTIONED.test(text)) continue;
      text.split('\n').forEach((line, i) => {
        if (/\bionActionSheetDidDismiss\b/.test(line)) {
          findings.push({
            filePath,
            line: i + 1,
            detail: ROLE_DETAIL,
            docsUrl: `${V9_DOCS}#action-sheet-interface-selected-role-removed`,
          });
        }
      });
    }

    return findings;
  },
};
