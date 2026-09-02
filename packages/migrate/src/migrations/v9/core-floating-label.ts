import type { Finding, Migration } from '../../types.js';
import { findOpeningTags, lineAt } from '../../ast/markup.js';
import { TEMPLATE_GLOBS } from '../../ast/text-scan.js';
import { V9_DOCS } from './docs.js';

/**
 * A floating label on `ion-input`, `ion-textarea`, and `ion-select` no longer
 * floats just because the control has slotted content. It floats on focus or a
 * value.
 *
 * Only reported when the element has slotted content: the change is
 * invisible without it, and floating labels are common enough that flagging
 * every one would be noise.
 *
 * Report-only - whether the old look mattered is a design call.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#input-floating-label-behavior
 */
/**
 * A floating `labelPlacement`, in every dialect: the plain attribute, an Angular
 * or Vue binding to a quoted string, and the JSX camelCase prop.
 */
const FLOATING = /label-?placement[^=]{0,3}=\s*["']['"]?\s*floating/i;
/** Slotted start/end content inside the element body. */
const SLOTTED = /slot\s*=\s*["'](start|end)["']/;

/** Lower-cased tag name (both spellings) -> the docs anchor for that component. */
const COMPONENTS: Record<string, string> = {
  'ion-input': `${V9_DOCS}#input-floating-label-behavior`,
  ioninput: `${V9_DOCS}#input-floating-label-behavior`,
  'ion-textarea': `${V9_DOCS}#textarea-floating-label-behavior`,
  iontextarea: `${V9_DOCS}#textarea-floating-label-behavior`,
  'ion-select': `${V9_DOCS}#select-floating-label-behavior`,
  ionselect: `${V9_DOCS}#select-floating-label-behavior`,
};

/** A `placeholder`, in any dialect (`placeholder=`, `[placeholder]=`, `:placeholder=`). */
const PLACEHOLDER = /\bplaceholder\b[^=]{0,3}=/i;
const DETAIL =
  'floating label with slotted content no longer floats by default. It floats on focus or a value';
const PLACEHOLDER_DETAIL =
  'with a floating label, the select placeholder is only visible while the select is focused';

/**
 * The text between an opening tag and its closing tag, or `undefined` for a
 * self-closing element or when no closing tag is found.
 */
function elementBody(source: string, tag: { name: string; end: number; text: string }): string | undefined {
  if (tag.text.endsWith('/>')) return undefined;
  const close = source.toLowerCase().indexOf(`</${tag.name}`, tag.end);
  return close === -1 ? undefined : source.slice(tag.end, close);
}

export const coreFloatingLabel: Migration = {
  id: 'core-floating-label',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#input-floating-label-behavior',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const filePath of ctx.glob(TEMPLATE_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      for (const tag of findOpeningTags(text, Object.keys(COMPONENTS))) {
        if (!FLOATING.test(tag.text)) continue;
        const line = lineAt(text, tag.start);
        const docsUrl = COMPONENTS[tag.name];

        // A floating select hides its placeholder until focus regardless of
        // slotted content, so this half isn't gated on it.
        if (tag.name.includes('select') && PLACEHOLDER.test(tag.text)) {
          findings.push({ filePath, line, detail: PLACEHOLDER_DETAIL, docsUrl });
          continue;
        }

        const body = elementBody(text, tag);
        if (body === undefined || !SLOTTED.test(body)) continue;
        findings.push({ filePath, line, detail: DETAIL, docsUrl });
      }
    }
    return findings;
  },
};
