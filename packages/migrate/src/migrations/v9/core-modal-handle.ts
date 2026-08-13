import type { Finding, Migration } from '../../types.js';
import { findOpeningTags, lineAt } from '../../ast/markup.js';
import { TEMPLATE_GLOBS } from '../../ast/text-scan.js';

/**
 * `handleBehavior` on `ion-modal` now defaults to `"cycle"` instead of
 * `"none"`. A sheet modal's handle becomes focusable, and activating it cycles
 * the sheet through its breakpoints.
 *
 * Scoped to sheet modals: without `breakpoints`/`initialBreakpoint` there is no
 * handle for the new default to affect. A modal that already sets
 * `handleBehavior` is left alone.
 *
 * Report-only: whether the old inert handle was intentional is the app's call.
 *
 * See https://ionicframework.com/docs/updating/9-0#modal
 */
const MODAL_TAGS = ['ion-modal', 'IonModal'];
/** A sheet modal declares breakpoints, in any binding dialect. */
const SHEET = /\b(breakpoints|initial-?breakpoint)\b/i;
/** An explicit opt-in or opt-out, so the new default is not a surprise. */
const HAS_BEHAVIOR = /\bhandle-?behavior\b/i;
/** A breakpoint in a controller options object, as opposed to a JSX prop. */
const OPTIONS_BREAKPOINT = /\binitialBreakpoint\s*:/g;

/**
 * The options object containing the breakpoint at `index`, found by walking out
 * to its braces. Scoping the `handleBehavior` check here keeps one inert sheet
 * from silencing the others beside it, and keeps a `.vue` template opt-out out
 * of its script block.
 */
function enclosingObject(text: string, index: number): string {
  let depth = 0;
  let start = 0;
  for (let i = index; i >= 0; i--) {
    if (text[i] === '}') depth++;
    else if (text[i] === '{') {
      if (depth === 0) {
        start = i;
        break;
      }
      depth--;
    }
  }
  depth = 0;
  let end = text.length;
  for (let i = start + 1; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      if (depth === 0) {
        end = i;
        break;
      }
      depth--;
    }
  }
  return text.slice(start, end);
}
// `.vue` included for a `<script setup>` calling `modalController.create`.
const SCRIPT_GLOBS = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'];
const DETAIL =
  'sheet modal handle now cycles breakpoints by default. Set handle-behavior="none" to keep it inert';

export const coreModalHandle: Migration = {
  id: 'core-modal-handle',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#modal',

  detect(ctx) {
    const findings: Finding[] = [];

    for (const filePath of ctx.glob(TEMPLATE_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      for (const tag of findOpeningTags(text, MODAL_TAGS)) {
        if (SHEET.test(tag.text) && !HAS_BEHAVIOR.test(tag.text)) {
          findings.push({ filePath, line: lineAt(text, tag.start), detail: DETAIL });
        }
      }
    }

    // Controller-created sheets never touch a template, so the options object is
    // the only place the breakpoint shows up.
    for (const filePath of ctx.glob(SCRIPT_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      for (const match of text.matchAll(OPTIONS_BREAKPOINT)) {
        if (!HAS_BEHAVIOR.test(enclosingObject(text, match.index))) {
          findings.push({ filePath, line: lineAt(text, match.index), detail: DETAIL });
        }
      }
    }

    return findings;
  },
};
