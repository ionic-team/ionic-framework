import type { Migration } from '../../types.js';
import { scanLines, SOURCE_GLOBS } from '../../ast/text-scan.js';

/**
 * `autocorrect` on `ion-input`/`ion-searchbar` is now a boolean defaulting to
 * `false`. A string attribute like `autocorrect="off"` now coerces to `true`
 * (autocorrect enabled) - the opposite of the intent. Report-only: the correct
 * fix (remove the attribute, or use a framework-specific boolean binding)
 * depends on the template dialect.
 *
 * See https://ionicframework.com/docs/updating/9-0#input
 */
export const coreAutocorrect: Migration = {
  id: 'core-autocorrect',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#input',

  detect(ctx) {
    return scanLines(ctx, SOURCE_GLOBS, (line) =>
      /autocorrect\s*=\s*["'](on|off)["']/.test(line)
        ? 'autocorrect is now boolean; remove the attribute or bind a boolean'
        : undefined
    );
  },
};
