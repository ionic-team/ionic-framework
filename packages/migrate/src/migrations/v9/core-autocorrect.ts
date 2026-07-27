import { Node, SyntaxKind } from 'ts-morph';
import type { JsxAttribute } from 'ts-morph';

import type { MigrationContext } from '../../context.js';
import type { Finding, Migration } from '../../types.js';
import { findOpeningTags, lineAt } from '../../ast/markup.js';
import { detectFrameworks } from '../../detect.js';

/**
 * `autocorrect` on `ion-input`/`ion-searchbar` is now a boolean defaulting to
 * `false`. Two forms need attention:
 *
 *   - `autocorrect="off"` changed behavior: the string now coerces to `true`,
 *     ENABLING autocorrect - the opposite of the author's intent. The fix drops
 *     the attribute, restoring the disabled default.
 *   - `autocorrect="on"` still coerces to `true`, so its behavior is unchanged,
 *     but the string form is the old API. The fix rewrites it to the boolean
 *     binding for the file's framework so apps land on the v9 way of doing it:
 *     `[autocorrect]="true"` (Angular), `autocorrect={true}` (React),
 *     `:autocorrect="true"` (Vue).
 *
 * The `on` rewrite is framework-specific, so it only runs where the dialect is
 * known: `.vue` and `.tsx` by extension, and `.html` when the project is an
 * Angular app. A vanilla `.html` has no property-binding syntax and `"on"`
 * already coerces to `true`, so it is left alone.
 *
 * All of this is scoped to `ion-input`/`ion-searchbar` so a native
 * `<input autocorrect="off">` (valid Safari HTML) is never touched. Surfaces
 * this can't auto-edit are reported by the companion `core-autocorrect-manual`.
 *
 * See https://ionicframework.com/docs/updating/9-0#input
 */
const TEMPLATE_GLOBS = ['**/*.html', '**/*.vue'];
const TEMPLATE_TAGS = ['ion-input', 'ion-searchbar'];
const JSX_TAGS = new Set(['IonInput', 'IonSearchbar']);
export const OFF_ATTR = /\s+autocorrect\s*=\s*["']off["']/;
// Capture the leading whitespace so the boolean-binding replacement can keep it.
export const ON_ATTR = /(\s+)autocorrect\s*=\s*["']on["']/;
export const DETAIL = 'remove autocorrect="off" (v9 boolean: "off" now enables autocorrect)';
export const ON_DETAIL = 'switch autocorrect="on" to the boolean binding (v9 autocorrect is a boolean)';

/**
 * `<IonInput>`/`<IonSearchbar>` `autocorrect` attributes with a literal
 * `"on"`/`"off"` value, across the loaded TS sources.
 */
function jsxAutocorrectAttrs(ctx: MigrationContext): { attr: JsxAttribute; value: 'on' | 'off' }[] {
  const found: { attr: JsxAttribute; value: 'on' | 'off' }[] = [];
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
          if (init && Node.isStringLiteral(init)) {
            const value = init.getLiteralValue();
            if (value === 'on' || value === 'off') found.push({ attr: jsxAttr, value });
          }
        }
      }
    }
  }
  return found;
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
    const isAngular = detectFrameworks(ctx).some((f) => f.framework === 'angular');

    for (const filePath of ctx.glob(TEMPLATE_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      // `on` is only convertible where the binding dialect is known: Vue SFCs,
      // or Angular templates (`.html` in an Angular app).
      const convertsOn = filePath.endsWith('.vue') || isAngular;
      for (const tag of findOpeningTags(text, TEMPLATE_TAGS)) {
        if (OFF_ATTR.test(tag.text)) {
          findings.push({ filePath, line: lineAt(text, tag.start), detail: DETAIL });
        } else if (convertsOn && ON_ATTR.test(tag.text)) {
          findings.push({ filePath, line: lineAt(text, tag.start), detail: ON_DETAIL });
        }
      }
    }

    for (const { attr, value } of jsxAutocorrectAttrs(ctx)) {
      findings.push({
        filePath: ctx.relative(attr.getSourceFile().getFilePath()),
        line: attr.getStartLineNumber(),
        detail: value === 'off' ? DETAIL : ON_DETAIL,
      });
    }

    return findings;
  },

  fix(ctx) {
    const isAngular = detectFrameworks(ctx).some((f) => f.framework === 'angular');

    for (const filePath of ctx.glob(TEMPLATE_GLOBS)) {
      const text = ctx.readFile(filePath);
      if (text === undefined) continue;
      // Vue binds with `:attr`, Angular with `[attr]`. Anything else (a vanilla
      // `.html`) keeps `on` as-is (see the header comment).
      const onReplacement = filePath.endsWith('.vue')
        ? '$1:autocorrect="true"'
        : isAngular
          ? '$1[autocorrect]="true"'
          : null;
      let out = text;
      // Edit right-to-left so earlier tag offsets stay valid.
      for (const tag of findOpeningTags(text, TEMPLATE_TAGS).reverse()) {
        let newTag = tag.text.replace(new RegExp(OFF_ATTR.source, 'g'), '');
        if (onReplacement) {
          newTag = newTag.replace(new RegExp(ON_ATTR.source, 'g'), onReplacement);
        }
        if (newTag !== tag.text) out = out.slice(0, tag.start) + newTag + out.slice(tag.end);
      }
      if (out !== text) ctx.writeFile(filePath, out);
    }

    for (const { attr, value } of jsxAutocorrectAttrs(ctx)) {
      if (value === 'off') {
        attr.remove();
      } else {
        attr.setInitializer('{true}');
      }
    }
  },
};
