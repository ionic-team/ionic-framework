import { Node, SyntaxKind } from 'ts-morph';
import type { JsxAttribute } from 'ts-morph';

import type { Finding, Migration } from '../../types.js';
import { isAutoFixableComponent, ROUTE_TAGS } from './react-router-6-routes.js';

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
const ROUTER_MODULES = new Set(['react-router', 'react-router-dom']);
const REMOVED_IMPORTS: Record<string, string> = {
  Redirect: 'Redirect removed. Use <Navigate to="..." replace />',
  useHistory: 'useHistory removed. Use useNavigate() or useIonRouter()',
  RouteComponentProps: 'RouteComponentProps removed. Use useParams/useLocation/useNavigate hooks',
};
const IONIC_MODULE = '@ionic/react';
const IONIC_REMOVED_IMPORTS: Record<string, string> = {
  IonRedirect: 'IonRedirect removed. Use React Router\'s <Navigate> wrapped in a <Route> for the redirect path',
};
const REMOVED_ROUTE_ATTRS: Record<string, string> = {
  render: `Route "render" prop removed. Use "element" with JSX`,
};
const COMPONENT_REMOVED = `Route "component" prop removed. Use "element" with JSX`;
const PATH_REGEX_REMOVED = 'regex path constraints removed. Use a literal path and match in the component';
// A regex constraint on a route param, e.g. `/:tab(sessions)`.
const PATH_REGEX = /:[A-Za-z_$][\w$]*\(/;

const ROUTER_COMPONENTS = new Set(['IonReactRouter', 'IonReactHashRouter', 'IonReactMemoryRouter']);
const HISTORY_PROP_REMOVED =
  'history prop removed. v6 routers reject a custom history (use initialEntries for IonReactMemoryRouter)';

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
          const detail = removed[named.getName()];
          if (detail) findings.push({ filePath, line: named.getStartLineNumber(), detail });
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
              if (name === 'history') findings.push({ filePath, line, detail: HISTORY_PROP_REMOVED });
              continue;
            }
            if (name === 'component') {
              // Bare `component={X}` is auto-fixed by react-router-6-routes, so
              // only report the forms it leaves untouched.
              if (!isAutoFixableComponent(jsxAttr)) {
                findings.push({ filePath, line, detail: COMPONENT_REMOVED });
              }
              continue;
            }
            if (name === 'path') {
              const value = stringAttrValue(jsxAttr);
              if (value !== undefined && PATH_REGEX.test(value)) {
                findings.push({ filePath, line, detail: PATH_REGEX_REMOVED });
              }
              continue;
            }
            const detail = REMOVED_ROUTE_ATTRS[name];
            if (detail) findings.push({ filePath, line, detail });
          }
        }
      }
    }
    return findings;
  },
};
