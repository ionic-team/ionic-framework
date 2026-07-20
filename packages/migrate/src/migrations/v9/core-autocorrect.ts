import { Node, SyntaxKind } from 'ts-morph';
import type { JsxAttribute } from 'ts-morph';

import type { MigrationContext } from '../../context.js';
import type { Finding, Migration } from '../../types.js';
import { findOpeningTags, lineAt } from '../../ast/markup.js';

/**
 * `autocorrect` on `ion-input`/`ion-searchbar` is now a boolean defaulting to
 * `false`. Only `autocorrect="off"` changed behavior: the string now coerces to
 * `true`, ENABLING autocorrect - the opposite of the author's intent.
 * (`autocorrect="on"` stays enabled in both versions, so it needs no change.)
 *
 * The safe, dialect-agnostic fix is to remove `autocorrect="off"`, restoring the
 * disabled default. Scoped to `ion-input`/`ion-searchbar` so a native
 * `<input autocorrect="off">` (valid Safari HTML) is never touched.
 *
 * This migration auto-fixes what it can safely edit: external templates
 * (`.html`), Vue SFCs (`.vue`), and React JSX (`.tsx`, `<IonInput>`). The
 * surfaces that can't be auto-edited (Angular inline templates, `.js`/`.jsx`)
 * are surfaced report-only by the companion `core-autocorrect-manual`.
 *
 * See https://ionicframework.com/docs/updating/9-0#input
 */
const TEMPLATE_GLOBS = ['**/*.html', '**/*.vue'];
const TEMPLATE_TAGS = ['ion-input', 'ion-searchbar'];
const JSX_TAGS = new Set(['IonInput', 'IonSearchbar']);
const OFF_ATTR = /\s+autocorrect\s*=\s*["']off["']/;
const DETAIL = 'remove autocorrect="off" (v9 boolean: "off" now enables autocorrect)';

/** JSX `<IonInput>`/`<IonSearchbar>` elements across the loaded TS sources. */
function jsxAutocorrectOff(ctx: MigrationContext): JsxAttribute[] {
  const attrs: JsxAttribute[] = [];
  for (const file of ctx.project.getSourceFiles()) {
    for (const kind of [SyntaxKind.JsxOpeningElement, SyntaxKind.JsxSelfClosingElement] as const) {
      for (const el of file.getDescendantsOfKind(kind)) {
        if (!JSX_TAGS.has(el.getTagNameNode().getText())) continue;
        // Only this element's own attributes. `getDescendantsOfKind` would also
        // return attributes on JSX nested inside an attribute expression.
        for (const attr of el.getAttributes()) {
          if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;
          const jsxAttr = attr as JsxAttribute;
          if (jsxAttr.getNameNode().getText() !== 'autocorrect') continue;
          const init = jsxAttr.getInitializer();
          if (init && Node.isStringLiteral(init) && init.getLiteralValue() === 'off') {
            attrs.push(jsxAttr);
          }
        }
      }
    }
  }
  return attrs;
}

export const coreAutocorrect: Migration = {
  id: 'core-autocorrect',
  framework: 'core',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#input',

  detect(ctx) {
    const findings: Finding[] = [];

    for (const filePath of ctx.glob(TEMPLATE_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      for (const tag of findOpeningTags(text, TEMPLATE_TAGS)) {
        if (OFF_ATTR.test(tag.text)) {
          findings.push({ filePath, line: lineAt(text, tag.start), detail: DETAIL });
        }
      }
    }

    for (const attr of jsxAutocorrectOff(ctx)) {
      findings.push({
        filePath: ctx.relative(attr.getSourceFile().getFilePath()),
        line: attr.getStartLineNumber(),
        detail: DETAIL,
      });
    }

    return findings;
  },

  fix(ctx) {
    for (const filePath of ctx.glob(TEMPLATE_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      let out = text;
      // Edit right-to-left so earlier tag offsets stay valid.
      for (const tag of findOpeningTags(text, TEMPLATE_TAGS).reverse()) {
        const newTag = tag.text.replace(new RegExp(OFF_ATTR.source, 'g'), '');
        if (newTag !== tag.text) out = out.slice(0, tag.start) + newTag + out.slice(tag.end);
      }
      if (out !== text) ctx.writeFile(filePath, out);
    }

    for (const attr of jsxAutocorrectOff(ctx)) {
      attr.remove();
    }
  },
};
