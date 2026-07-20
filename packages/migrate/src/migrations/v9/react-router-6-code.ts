import { SyntaxKind } from 'ts-morph';
import type { JsxAttribute } from 'ts-morph';

import type { Finding, Migration } from '../../types.js';
import { isAutoFixableComponent } from './react-router-6-routes.js';

/**
 * React Router v6 removes and renames a number of v5 APIs. The parts that need
 * semantic rework (hooks replacing render-prop patterns, route-graph-aware
 * `/*` suffixes) are report-only: this migration pinpoints every such v5
 * pattern with a file/line and a pointer to the docs.
 *
 * The deterministic subset (`exact`, bare `component={X}`) is auto-fixed by
 * `react-router-6-routes` and is intentionally NOT reported here so the two
 * migrations don't overlap. A `component` prop `react-router-6-routes` cannot
 * auto-fix (a non-identifier initializer like `component={Views.Home}`) is
 * still reported here so the removed v6 prop is never silently dropped.
 *
 * See https://ionicframework.com/docs/updating/9-0#react-router
 */
const REMOVED_IMPORTS: Record<string, string> = {
  Redirect: 'Redirect removed; use <Navigate to="..." replace />',
  useHistory: 'useHistory removed; use useNavigate() or useIonRouter()',
  RouteComponentProps: 'RouteComponentProps removed; use useParams/useLocation/useNavigate hooks',
};
const REMOVED_ROUTE_ATTRS: Record<string, string> = {
  render: `Route "render" prop removed; use "element" with JSX`,
};
const COMPONENT_REMOVED = `Route "component" prop removed; use "element" with JSX`;
const ROUTER_MODULES = new Set(['react-router', 'react-router-dom']);
const ROUTE_TAGS = new Set(['Route', 'IonRoute']);

export const reactRouter6Code: Migration = {
  id: 'react-router-6-code',
  framework: 'react',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#react-router',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const file of ctx.project.getSourceFiles()) {
      const filePath = ctx.relative(file.getFilePath());

      for (const imp of file.getImportDeclarations()) {
        if (!ROUTER_MODULES.has(imp.getModuleSpecifierValue())) continue;
        for (const named of imp.getNamedImports()) {
          const detail = REMOVED_IMPORTS[named.getName()];
          if (detail) findings.push({ filePath, line: named.getStartLineNumber(), detail });
        }
      }

      for (const kind of [SyntaxKind.JsxOpeningElement, SyntaxKind.JsxSelfClosingElement] as const) {
        for (const el of file.getDescendantsOfKind(kind)) {
          if (!ROUTE_TAGS.has(el.getTagNameNode().getText())) continue;
          for (const attr of el.getAttributes()) {
            if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;
            const jsxAttr = attr as JsxAttribute;
            const name = jsxAttr.getNameNode().getText();
            if (name === 'component') {
              // Bare `component={X}` is auto-fixed by react-router-6-routes; only
              // report the forms it leaves untouched.
              if (!isAutoFixableComponent(jsxAttr)) {
                findings.push({ filePath, line: jsxAttr.getStartLineNumber(), detail: COMPONENT_REMOVED });
              }
              continue;
            }
            const detail = REMOVED_ROUTE_ATTRS[name];
            if (detail) findings.push({ filePath, line: jsxAttr.getStartLineNumber(), detail });
          }
        }
      }
    }
    return findings;
  },
};
