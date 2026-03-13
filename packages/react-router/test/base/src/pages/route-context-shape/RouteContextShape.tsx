/**
 * Test page that validates the UNSAFE_RouteContext shape at runtime.
 *
 * Context layers in Ionic React:
 * 1. RR6 provides native RouteContext at the router level
 * 2. StackManager.tsx consumes native RR6 context and validates it via validateRouteContext()
 * 3. ReactRouterViewStack.renderViewItem wraps each view in RouteContext.Provider
 *    with Ionic's constructed context (built by buildContextMatches)
 * 4. Components inside IonRouterOutlet read Ionic's constructed context
 *
 * The RouteContextValidator components here read layer 3/4 (Ionic's constructed context).
 * They verify that Ionic's buildContextMatches produces the correct shape.
 * The native RR6 context (layer 1) is validated by the validateRouteContext() call
 * in StackManager.tsx — the Cypress spec checks this via the console warning assertion.
 */
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
  IonButton,
  IonLabel,
  IonItem,
  IonList,
} from '@ionic/react';
import React, { useContext, useMemo } from 'react';
import { Route, useParams, useNavigate, UNSAFE_RouteContext } from 'react-router-dom';

/**
 * Validates a single match entry from the RouteContext matches array.
 */
function validateMatchEntry(entry: unknown): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (typeof entry !== 'object' || entry === null) {
    return { valid: false, missing: ['not-an-object'] };
  }

  const e = entry as Record<string, unknown>;

  if (typeof e.params !== 'object' || e.params === null) missing.push('params');
  if (typeof e.pathname !== 'string') missing.push('pathname');
  if (typeof e.pathnameBase !== 'string') missing.push('pathnameBase');

  if (typeof e.route !== 'object' || e.route === null) {
    missing.push('route');
  } else {
    const route = e.route as Record<string, unknown>;
    if (typeof route.id !== 'string') missing.push('route.id');
    if (typeof route.hasErrorBoundary !== 'boolean') missing.push('route.hasErrorBoundary');
  }

  return { valid: missing.length === 0, missing };
}

/**
 * Component that reads RouteContext and exposes validation results as data attributes.
 * Note: Inside IonRouterOutlet, this reads Ionic's constructed context, not RR6's native context.
 */
const RouteContextValidator: React.FC<{ id: string }> = ({ id }) => {
  const routeContext = useContext(UNSAFE_RouteContext);

  const validation = useMemo(() => {
    if (!routeContext) {
      return { hasContext: false, matchCount: 0, allValid: false, details: 'no-context' };
    }

    const matches = routeContext.matches;
    if (!Array.isArray(matches)) {
      return { hasContext: true, matchCount: 0, allValid: false, details: 'matches-not-array' };
    }

    const results = matches.map((m, i) => {
      const { valid, missing } = validateMatchEntry(m);
      return { index: i, valid, missing };
    });

    const allValid = results.every((r) => r.valid);
    const invalidEntries = results.filter((r) => !r.valid);
    const details = allValid
      ? 'all-valid'
      : invalidEntries.map((e) => `match[${e.index}]:${e.missing.join(',')}`).join(';');

    return { hasContext: true, matchCount: matches.length, allValid, details };
  }, [routeContext]);

  return (
    <div
      id={`validator-${id}`}
      data-has-context={String(validation.hasContext)}
      data-match-count={String(validation.matchCount)}
      data-all-valid={String(validation.allValid)}
      data-details={validation.details}
    >
      <p>Context: {validation.hasContext ? 'yes' : 'no'}</p>
      <p>Matches: {validation.matchCount}</p>
      <p>Valid: {validation.allValid ? 'yes' : 'no'}</p>
      <p>Details: {validation.details}</p>
    </div>
  );
};

/**
 * A nested page that validates context at a deeper level.
 */
const NestedPage: React.FC = () => {
  const params = useParams();
  return (
    <IonPage data-pageid="route-context-nested">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nested (id: {params.id})</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RouteContextValidator id="nested" />
        <div id="nested-params">{JSON.stringify(params)}</div>
      </IonContent>
    </IonPage>
  );
};

/**
 * Root page for the route-context-shape test.
 */
const RouteContextShape: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonRouterOutlet>
      <Route
        path="details/:id"
        element={<NestedPage />}
      />
      <Route
        path=""
        element={
          <IonPage data-pageid="route-context-root">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Route Context Shape</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <RouteContextValidator id="root" />
              <IonList>
                <IonItem>
                  <IonLabel>
                    <IonButton id="go-nested" onClick={() => navigate('details/42')}>
                      Go to Nested
                    </IonButton>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </IonPage>
        }
      />
    </IonRouterOutlet>
  );
};

export default RouteContextShape;
