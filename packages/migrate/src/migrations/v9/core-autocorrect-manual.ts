import type { Finding, Migration } from '../../types.js';
import { findOpeningTags, lineAt } from '../../ast/markup.js';

/**
 * Report-only companion to `core-autocorrect`. Removing `autocorrect="off"` from
 * `ion-input`/`ion-searchbar` is required for v9 (see that migration for why),
 * but two surfaces can't be auto-edited and so are flagged for manual removal
 * rather than dropped:
 *
 *   - Angular INLINE templates (a `template:` string in a `.ts` decorator):
 *     text-editing a ts-morph-loaded file would be clobbered by `save()`.
 *   - `.js`/`.jsx` React files: never loaded into ts-morph (`allowJs: false`).
 *
 * `.tsx` is intentionally excluded here since `core-autocorrect` auto-fixes it.
 * `findOpeningTags` lower-cases tag names, so the kebab (Angular inline) and
 * Pascal (`.jsx`) spellings are both matched from the one list.
 *
 * See https://ionicframework.com/docs/updating/9-0#input
 */
const REPORT_GLOBS = ['**/*.ts', '**/*.js', '**/*.jsx'];
const REPORT_TAGS = ['ion-input', 'ion-searchbar', 'IonInput', 'IonSearchbar'];
const OFF_ATTR = /\s+autocorrect\s*=\s*["']off["']/;
const DETAIL = 'remove autocorrect="off" (v9 boolean: "off" now enables autocorrect)';

export const coreAutocorrectManual: Migration = {
  id: 'core-autocorrect-manual',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#input',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const filePath of ctx.glob(REPORT_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      for (const tag of findOpeningTags(text, REPORT_TAGS)) {
        if (OFF_ATTR.test(tag.text)) {
          findings.push({ filePath, line: lineAt(text, tag.start), detail: DETAIL });
        }
      }
    }
    return findings;
  },
};
