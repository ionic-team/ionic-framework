import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import React from 'react';
import { Navigate, Route, useSearchParams } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Regression page for ionic-team/ionic-framework#31709: when the app pushes
 * a route in an `IonTabs` outlet and that route immediately redirects, the
 * tabs outlet can end up with two pages that are not hidden.
 *
 * - Path A: the redirect lands while the forward transition to the
 *   redirecting route is still running. The empty `ionPage` outlet of the
 *   redirecting route (Banana) is left visible on top.
 * - Path B: the redirect lands before the redirecting route's page
 *   registers. The tab the user pushed from (Orange) is never hidden.
 *
 * Apple, Orange and Banana are the three `ionPage` outlets in the tabs
 * outlet. The Banana outlet's only child, `redirect`, renders a
 * `<Navigate replace to=".../apple" />` after `delay` ms (from the
 * `?delay=` query param), or immediately when its "Redirect now" button
 * is pressed (used by the path A test to land the redirect while the
 * forward transition is in flight).
 */
const ApplePage: React.FC = () => {
  return (
    <IonPage data-pageid="redirect-apple">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Apple</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <TestDescription>
          Go to the Orange tab, then press a redirect button. After the redirect only the Apple outlet should be
          visible.
        </TestDescription>
      </IonContent>
    </IonPage>
  );
};

const OrangePage: React.FC = () => {
  const router = useIonRouter();
  return (
    <IonPage data-pageid="redirect-orange">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Orange</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton
          id="redirect-0ms"
          onClick={() => router.push('/redirect-stale-commit/banana/redirect?delay=0', 'forward', 'push')}
        >
          Redirect after 0 ms
        </IonButton>
        <IonButton
          id="redirect-10ms"
          onClick={() => router.push('/redirect-stale-commit/banana/redirect?delay=10', 'forward', 'push')}
        >
          Redirect after 10 ms
        </IonButton>
        <IonButton
          id="redirect-manual"
          onClick={() => router.push('/redirect-stale-commit/banana/redirect', 'forward', 'push')}
        >
          Go to Banana (redirect manually)
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const RedirectToApple: React.FC = () => {
  const [searchParams] = useSearchParams();
  const delayParam = searchParams.get('delay');
  const delay = delayParam === null ? null : Number(delayParam);
  const [redirect, setRedirect] = React.useState(false);
  const router = useIonRouter();

  React.useEffect(() => {
    if (delay === null) {
      return;
    }
    const timeout = setTimeout(() => setRedirect(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  if (redirect) {
    return <Navigate replace to="/redirect-stale-commit/apple" />;
  }
  return (
    <IonPage data-pageid="redirect-banana">
      <IonContent>
        <IonButton id="redirect-now" onClick={() => router.push('/redirect-stale-commit/apple', 'none', 'replace')}>
          Redirect now
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const RedirectStaleCommit: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet id="redirect-tabs">
        <Route
          path="apple/*"
          element={
            <IonRouterOutlet ionPage id="apple-outlet">
              <Route index element={<ApplePage />} />
            </IonRouterOutlet>
          }
        />
        <Route
          path="orange/*"
          element={
            <IonRouterOutlet ionPage id="orange-outlet">
              <Route index element={<OrangePage />} />
            </IonRouterOutlet>
          }
        />
        <Route
          path="banana/*"
          element={
            <IonRouterOutlet ionPage id="banana-outlet">
              <Route path="redirect" element={<RedirectToApple />} />
            </IonRouterOutlet>
          }
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton id="tab-apple" tab="apple" href="/redirect-stale-commit/apple">
          Apple
        </IonTabButton>
        <IonTabButton id="tab-orange" tab="orange" href="/redirect-stale-commit/orange">
          Orange
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default RedirectStaleCommit;
