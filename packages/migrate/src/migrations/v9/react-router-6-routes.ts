import { SyntaxKind } from 'ts-morph';
import type { JsxAttribute, JsxExpression, JsxOpeningElement, JsxSelfClosingElement, SourceFile } from 'ts-morph';

import type { MigrationContext } from '../../context.js';
import type { Migration } from '../../types.js';
import { V9_DOCS } from './docs.js';

/** The route element tags handled by both react-router migrations. */
export const ROUTE_TAGS = new Set(['Route', 'IonRoute']);

type RouteElement = JsxOpeningElement | JsxSelfClosingElement;

/** Every `<Route>`/`<IonRoute>` opening/self-closing element in a file. */
function routeElements(file: SourceFile): RouteElement[] {
  const els: RouteElement[] = [];
  for (const kind of [SyntaxKind.JsxOpeningElement, SyntaxKind.JsxSelfClosingElement] as const) {
    for (const el of file.getDescendantsOfKind(kind)) {
      if (ROUTE_TAGS.has(el.getTagNameNode().getText())) els.push(el);
    }
  }
  return els;
}

/** The bare identifier of a `component={X}` attribute, or undefined if not simple. */
function simpleComponentName(attr: JsxAttribute): string | undefined {
  const init = attr.getInitializer();
  if (!init || init.getKind() !== SyntaxKind.JsxExpression) return undefined;
  const expr = (init as JsxExpression).getExpression();
  return expr && expr.getKind() === SyntaxKind.Identifier ? expr.getText() : undefined;
}

/**
 * Whether this migration will auto-fix a `component` attribute (only bare
 * `component={X}` identifiers are rewritten). `react-router-6-code` uses this to
 * report the non-fixable forms report-only, so no removed `component` prop is
 * silently dropped between the two migrations.
 */
export function isAutoFixableComponent(attr: JsxAttribute): boolean {
  return simpleComponentName(attr) !== undefined;
}

/** A route attribute this migration can auto-fix, with how to describe/apply it. */
interface RouteAction {
  attr: JsxAttribute;
  detail: string;
  docsUrl: string;
  apply(): void;
}

/**
 * Walk every auto-fixable attribute on `<Route>`/`<IonRoute>` elements. This is
 * the single source of truth so `detect` (describe) and `fix` (apply) can never
 * drift. `component` with a non-identifier initializer is intentionally skipped
 * (left for `react-router-6-code` territory) rather than mangled.
 */
function routeActions(ctx: MigrationContext): RouteAction[] {
  const actions: RouteAction[] = [];
  for (const file of ctx.project.getSourceFiles()) {
    for (const el of routeElements(file)) {
      // Only this element's own attributes. `getDescendantsOfKind` would also
      // return attributes on JSX nested inside an attribute expression (e.g. a
      // `<Route>` returned from a `render={...}` prop), mutating out-of-scope
      // elements and double-collecting a nested Route's attributes.
      for (const attr of el.getAttributes()) {
        if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;
        const jsxAttr = attr as JsxAttribute;
        const name = jsxAttr.getNameNode().getText();
        if (name === 'exact') {
          actions.push({
            attr: jsxAttr,
            detail: 'remove `exact` (v6 matches exactly by default)',
            docsUrl: `${V9_DOCS}#exact-prop-removed`,
            apply: () => jsxAttr.remove(),
          });
        } else if (name === 'component') {
          const componentName = simpleComponentName(jsxAttr);
          if (componentName !== undefined) {
            actions.push({
              attr: jsxAttr,
              detail: `component={${componentName}} -> element={<${componentName} />}`,
              docsUrl: `${V9_DOCS}#route-definition-changes`,
              apply: () => jsxAttr.replaceWithText(`element={<${componentName} />}`),
            });
          }
        }
      }
    }
  }
  return actions;
}

/**
 * The deterministic, auto-fixable subset of the React Router v6 route changes:
 *
 *   - `<Route component={Home} />`  ->  `<Route element={<Home />} />`
 *   - `<Route exact />`             ->  `<Route />`  (v6 matches exactly by default)
 *
 * The semantic changes that need developer judgement (`render` prop, removed
 * hooks/props) stay report-only in `react-router-6-code`.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#react-router
 */
export const reactRouter6Routes: Migration = {
  id: 'react-router-6-routes',
  framework: 'react',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#react-router',

  detect(ctx) {
    return routeActions(ctx).map(({ attr, detail, docsUrl }) => ({
      filePath: ctx.relative(attr.getSourceFile().getFilePath()),
      line: attr.getStartLineNumber(),
      detail,
      docsUrl,
    }));
  },

  fix(ctx) {
    // Apply bottom-up (last position first) so earlier nodes' positions stay
    // valid as we mutate.
    for (const action of routeActions(ctx).reverse()) {
      action.apply();
    }
  },
};
