/**
 * Verifies that useParams() returns correct values after a Navigate
 * (catch-all redirect) fires inside IonRouterOutlet.
 *
 * @see https://github.com/ionic-team/ionic-framework/issues/23743
 */

import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/react';
import { triangle, square } from 'ionicons/icons';
import React from 'react';
import { Route, Navigate, useParams } from 'react-router-dom';

/**
 * Scenario 1: Tabs with catch-all Navigate redirect
 *
 * Structure:
 *   /redirect-params/tabs → redirects to /redirect-params/tabs/tab2
 *   /redirect-params/tabs/tab1/:id → Tab1 with param
 *   /redirect-params/tabs/tab2 → Tab2
 */
const TabsWithRedirect: React.FC = () => {
  return (
    <IonTabs data-pageid="redirect-params-tabs">
      <IonRouterOutlet>
        <Route path="tab1/:id" element={<Tab1WithParam />} />
        <Route path="tab2" element={<Tab2Page />} />
        <Route path="*" element={<Navigate to="tab2" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/redirect-params/tabs/tab1/TESTING">
          <IonIcon icon={triangle} />
          <IonLabel>Tab1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/redirect-params/tabs/tab2">
          <IonIcon icon={square} />
          <IonLabel>Tab2</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const Tab1WithParam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <IonPage data-pageid="tab1-with-param">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="param-value">{id}</div>
        <div id="param-display">Tab 1 with param: {id || 'undefined'}</div>
      </IonContent>
    </IonPage>
  );
};

const Tab2Page: React.FC = () => {
  return (
    <IonPage data-pageid="tab2-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="tab2-loaded">Tab 2 loaded</div>
        <IonButton routerLink="/redirect-params/tabs/tab1/TESTING" id="go-to-tab1">
          Go to Tab 1 with param
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

/**
 * Scenario 2: Flat outlet with catch-all Navigate redirect
 *
 * Structure:
 *   /redirect-params/flat → redirects to /redirect-params/flat/home
 *   /redirect-params/flat/home → Home page
 *   /redirect-params/flat/details/:id → Details with param
 */
const FlatOutletWithRedirect: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="home" element={<HomePage />} />
      <Route path="details/:id" element={<DetailsPage />} />
      <Route path="*" element={<Navigate to="home" replace />} />
    </IonRouterOutlet>
  );
};

const HomePage: React.FC = () => {
  return (
    <IonPage data-pageid="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="home-loaded">Home loaded</div>
        <IonButton routerLink="/redirect-params/flat/details/42" id="go-to-details-42">
          Go to Details 42
        </IonButton>
        <IonButton routerLink="/redirect-params/flat/details/99" id="go-to-details-99">
          Go to Details 99
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <IonPage data-pageid="details-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="detail-param-value">{id}</div>
        <div id="detail-display">Detail ID: {id || 'undefined'}</div>
      </IonContent>
    </IonPage>
  );
};

/**
 * Main entry: routes into tabs vs flat scenarios
 */
const RedirectParams: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route path="tabs/*" element={<TabsWithRedirect />} />
      <Route path="flat/*" element={<FlatOutletWithRedirect />} />
      <Route
        index
        element={
          <IonPage data-pageid="redirect-params-landing">
            <IonHeader>
              <IonToolbar>
                <IonTitle>Redirect Params Test</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonButton routerLink="/redirect-params/tabs" id="go-to-tabs-scenario">
                Tabs Scenario
              </IonButton>
              <IonButton routerLink="/redirect-params/flat" id="go-to-flat-scenario">
                Flat Outlet Scenario
              </IonButton>
            </IonContent>
          </IonPage>
        }
      />
    </IonRouterOutlet>
  );
};

export default RedirectParams;
