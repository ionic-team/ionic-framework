import type { Migration } from '../../types.js';
import { scanLines, STYLE_GLOBS } from '../../ast/text-scan.js';
import { V9_DOCS } from './docs.js';

/**
 * `ion-input`, `ion-textarea`, and `ion-select` reorganized their internal DOM
 * to support floating labels alongside slotted content. Stylesheets reaching
 * into that structure stop matching, with no error.
 *
 * Report-only: which replacement is right depends on what the rule was for, and
 * `part="inner"` on `ion-select` has no replacement at all.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#input-internal-dom-structure-changes
 */
/** One old-structure signal, and what to tell the developer about it. */
interface StructureRule {
  pattern: RegExp;
  detail: string;
  docsUrl: string;
}

const INPUT_DOCS = `${V9_DOCS}#input-internal-dom-structure-changes`;
const TEXTAREA_DOCS = `${V9_DOCS}#textarea-internal-dom-structure-changes`;
const SELECT_DOCS = `${V9_DOCS}#select-internal-dom-structure-changes`;

/**
 * Only the pairings that broke are matched: `.native-wrapper`, `.input-wrapper`,
 * and `.textarea-wrapper` all still exist in v9 on their own.
 */
const RULES: StructureRule[] = [
  {
    pattern: /\.textarea-wrapper-inner\b[^{;]*\.label-text-wrapper\b/,
    detail: '.label-text-wrapper moved out of .textarea-wrapper-inner into .textarea-control',
    docsUrl: TEXTAREA_DOCS,
  },
  {
    pattern: /\.textarea-wrapper-inner\b/,
    detail: '.textarea-wrapper-inner was removed. The label and native wrapper now live in .textarea-control',
    docsUrl: TEXTAREA_DOCS,
  },
  {
    pattern: /\.start-slot-wrapper\b/,
    detail: '.start-slot-wrapper was renamed .textarea-start and moved up to .textarea-wrapper',
    docsUrl: TEXTAREA_DOCS,
  },
  {
    pattern: /\.end-slot-wrapper\b/,
    detail: '.end-slot-wrapper was renamed .textarea-end and moved up to .textarea-wrapper',
    docsUrl: TEXTAREA_DOCS,
  },
  {
    pattern: /\.select-wrapper-inner\b/,
    detail: '.select-wrapper-inner was removed. Use .select-control, .select-start, or .select-end',
    docsUrl: SELECT_DOCS,
  },
  {
    // Only on ion-select: `::part(inner)` is a live part on other components.
    pattern: /ion-select[^{;]*::part\(\s*inner\s*\)/,
    detail: 'the select part="inner" was removed. Use the new part="control", part="start", or part="end"',
    docsUrl: SELECT_DOCS,
  },
  // The slot rules come before the wrapper rule below: the guide's own example,
  // `.input-wrapper .native-wrapper [slot="start"]`, matches both, and the slot
  // answer is the one that matches in v9.
  {
    pattern: /\.native-wrapper\b[^{;]*(\[slot=["']?start|\.input-clear-icon\b)/,
    detail: 'start slot content moved out of .native-wrapper into .input-start (clear icon into .input-end)',
    docsUrl: INPUT_DOCS,
  },
  {
    pattern: /\.native-wrapper\b[^{;]*\[slot=["']?end/,
    detail: 'end slot content moved out of .native-wrapper into .input-end',
    docsUrl: INPUT_DOCS,
  },
  {
    pattern: /\.input-wrapper\b[^{;]*\.label-text-wrapper\b/,
    detail: '.label-text-wrapper is no longer inside .input-wrapper. It moved into .input-control',
    docsUrl: INPUT_DOCS,
  },
  {
    pattern: /\.input-wrapper\b[^{;]*\.native-wrapper\b/,
    detail: '.native-wrapper is no longer inside .input-wrapper. It moved into .input-control',
    docsUrl: INPUT_DOCS,
  },
  {
    pattern: /\.select-wrapper\b[^{;]*\.label-text-wrapper\b/,
    detail: '.label-text-wrapper is no longer inside .select-wrapper. It moved into .select-control',
    docsUrl: SELECT_DOCS,
  },
];

export const coreFormStructure: Migration = {
  id: 'core-form-structure',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#input-internal-dom-structure-changes',

  detect(ctx) {
    return scanLines(ctx, STYLE_GLOBS, (line) => {
      const rule = RULES.find((r) => r.pattern.test(line));
      return rule && { detail: rule.detail, docsUrl: rule.docsUrl };
    });
  },
};
