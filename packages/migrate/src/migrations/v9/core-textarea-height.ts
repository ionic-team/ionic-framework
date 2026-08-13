import type { Finding, Migration } from '../../types.js';
import { STYLE_GLOBS } from '../../ast/text-scan.js';

/**
 * The Material Design minimum height of `ion-textarea` went from `56px` to
 * `72px`, and is now the same regardless of `fill` or `labelPlacement`. Layout
 * built around the old number silently shifts.
 *
 * Report-only, and scoped to stylesheets that mention `ion-textarea`: `56px` is
 * common enough that flagging it everywhere would be noise. A stylesheet that
 * never names the element is missed.
 *
 * See https://ionicframework.com/docs/updating/9-0#minimum-height-change
 */
const OLD_HEIGHT = /\b56px\b/;
const TEXTAREA = /ion-textarea/;

export const coreTextareaHeight: Migration = {
  id: 'core-textarea-height',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#minimum-height-change',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const filePath of ctx.glob(STYLE_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined || !TEXTAREA.test(text)) continue;
      text.split('\n').forEach((line, i) => {
        if (OLD_HEIGHT.test(line)) {
          findings.push({
            filePath,
            line: i + 1,
            detail: 'ion-textarea is 72px tall in md mode now, not 56px. Update or override this value',
          });
        }
      });
    }
    return findings;
  },
};
