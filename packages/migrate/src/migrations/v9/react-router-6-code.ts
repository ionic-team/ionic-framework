import { SyntaxKind } from 'ts-morph';
import type { JsxAttribute } from 'ts-morph';

import type { Finding, Migration } from '../../types.js';

/**
 * React Router v6 removes and renames a number of v5 APIs. These changes need
 * semantic rework (hooks replacing render-prop patterns, route-graph-aware
 * `/*` suffixes), so this migration is report-only: it pinpoints every v5
 * pattern with a file/line and a pointer to the docs.
 *
 * See https://ionicframework.com/docs/updating/9-0#react-router
 */
const REMOVED_IMPORTS: Record<string, string> = {
  Redirect: 'Redirect removed; use <Navigate to="..." replace />',
  useHistory: 'useHistory removed; use useNavigate() or useIonRouter()',
  RouteComponentProps: 'RouteComponentProps removed; use useParams/useLocation/useNavigate hooks',
};
const REMOVED_ROUTE_ATTRS: Record<string, string> = {
  component: `Route "component" prop removed; use "element" with JSX`,
  render: `Route "render" prop removed; use "element" with JSX`,
  exact: `Route "exact" prop removed; routes match exactly by default`,
};
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
            const name = (attr as JsxAttribute).getNameNode().getText();
            const detail = REMOVED_ROUTE_ATTRS[name];
            if (detail) findings.push({ filePath, line: attr.getStartLineNumber(), detail });
          }
        }
      }
    }
    return findings;
  },
};
