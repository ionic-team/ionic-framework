import { Node, SyntaxKind } from 'ts-morph';
import type { JsxAttribute } from 'ts-morph';

import type { Finding, Migration } from '../../types.js';
import { isAutoFixableComponent, ROUTE_TAGS, V9_DOCS } from './react-router-6-routes.js';

/**
 * Reports the React Router v5 -> v6 changes that need semantic rework: the
 * removed react-router imports (`Redirect`, `useHistory`, `RouteComponentProps`),
 * `IonRedirect` from `@ionic/react`, the removed `render`/`component` route
 * props, the removed `history` prop on the `IonReact*Router` components, and
 * regex path constraints. The deterministic `exact`/bare-`component={X}` rewrites
 * are auto-fixed by `react-router-6-routes`, so a `component` prop it can't
 * auto-fix (a non-identifier initializer) is reported here instead of dropped.
 *
 * See https://ionicframework.com/docs/updating/9-0#react-router
 */
/**
 * A reported change: what to tell the developer, and the docs subsection that
 * explains it. This migration spans several of the React Router changes, so each
 * finding carries its own anchor instead of all of them pointing at the parent
 * "React Router" section.
 */
interface ReportedChange {
  detail: string;
  docsUrl: string;
}

const ROUTER_MODULES = new Set(['react-router', 'react-router-dom']);
const REMOVED_IMPORTS: Record<string, ReportedChange> = {
  Redirect: {
    detail: 'Redirect removed. Use <Navigate to="..." replace />',
    docsUrl: `${V9_DOCS}#redirect-changes`,
  },
  useHistory: {
    detail: 'useHistory removed. Use useNavigate() or useIonRouter()',
    docsUrl: `${V9_DOCS}#programmatic-navigation`,
  },
  RouteComponentProps: {
    detail: 'RouteComponentProps removed. Use useParams/useLocation/useNavigate hooks',
    docsUrl: `${V9_DOCS}#routecomponentprops-removed`,
  },
};
const IONIC_MODULE = '@ionic/react';
const IONIC_REMOVED_IMPORTS: Record<string, ReportedChange> = {
  IonRedirect: {
    detail: 'IonRedirect removed. Use React Router\'s <Navigate> wrapped in a <Route> for the redirect path',
    docsUrl: `${V9_DOCS}#ionredirect-removed`,
  },
};
const REMOVED_ROUTE_ATTRS: Record<string, ReportedChange> = {
  render: {
    detail: `Route "render" prop removed. Use "element" with JSX`,
    docsUrl: `${V9_DOCS}#render-prop-removed`,
  },
};
const COMPONENT_REMOVED: ReportedChange = {
  detail: `Route "component" prop removed. Use "element" with JSX`,
  docsUrl: `${V9_DOCS}#route-definition-changes`,
};
const PATH_REGEX_REMOVED: ReportedChange = {
  detail: 'regex path constraints removed. Use a literal path and match in the component',
  docsUrl: `${V9_DOCS}#path-regex-constraints-removed`,
};
// A regex constraint on a route param, e.g. `/:tab(sessions)`.
const PATH_REGEX = /:[A-Za-z_$][\w$]*\(/;

const ROUTER_COMPONENTS = new Set(['IonReactRouter', 'IonReactHashRouter', 'IonReactMemoryRouter']);
const HISTORY_PROP_REMOVED: ReportedChange = {
  detail: 'history prop removed. v6 routers reject a custom history (use initialEntries for IonReactMemoryRouter)',
  docsUrl: `${V9_DOCS}#custom-history-prop-removed`,
};

/** The static string value of an attribute, or undefined if it isn't a plain string. */
function stringAttrValue(attr: JsxAttribute): string | undefined {
  const init = attr.getInitializer();
  if (init && Node.isStringLiteral(init)) return init.getLiteralValue();
  return undefined;
}

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
        const mod = imp.getModuleSpecifierValue();
        const removed = ROUTER_MODULES.has(mod) ? REMOVED_IMPORTS : mod === IONIC_MODULE ? IONIC_REMOVED_IMPORTS : undefined;
        if (!removed) continue;
        for (const named of imp.getNamedImports()) {
          const change = removed[named.getName()];
          if (change) findings.push({ filePath, line: named.getStartLineNumber(), ...change });
        }
      }

      for (const kind of [SyntaxKind.JsxOpeningElement, SyntaxKind.JsxSelfClosingElement] as const) {
        for (const el of file.getDescendantsOfKind(kind)) {
          const tag = el.getTagNameNode().getText();
          const isRoute = ROUTE_TAGS.has(tag);
          const isRouter = ROUTER_COMPONENTS.has(tag);
          if (!isRoute && !isRouter) continue;
          for (const attr of el.getAttributes()) {
            if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;
            const jsxAttr = attr as JsxAttribute;
            const name = jsxAttr.getNameNode().getText();
            const line = jsxAttr.getStartLineNumber();

            if (isRouter) {
              if (name === 'history') findings.push({ filePath, line, ...HISTORY_PROP_REMOVED });
              continue;
            }
            if (name === 'component') {
              // Bare `component={X}` is auto-fixed by react-router-6-routes, so
              // only report the forms it leaves untouched.
              if (!isAutoFixableComponent(jsxAttr)) {
                findings.push({ filePath, line, ...COMPONENT_REMOVED });
              }
              continue;
            }
            if (name === 'path') {
              const value = stringAttrValue(jsxAttr);
              if (value !== undefined && PATH_REGEX.test(value)) {
                findings.push({ filePath, line, ...PATH_REGEX_REMOVED });
              }
              continue;
            }
            const change = REMOVED_ROUTE_ATTRS[name];
            if (change) findings.push({ filePath, line, ...change });
          }
        }
      }
    }
    return findings;
  },
};
