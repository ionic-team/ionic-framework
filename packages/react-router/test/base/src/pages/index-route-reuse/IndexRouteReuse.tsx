import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonButton,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { triangle, ellipse, square } from 'ionicons/icons';
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Test page for index route reuse across tabs with nested outlets.
 *
 * Each tab has its own nested IonRouterOutlet with an index route that
 * renders distinct content. This tests that switching between tabs shows
 * the correct index route content and doesn't incorrectly reuse a view
 * item from another tab's index route.
 */

// Tab 1 nested outlet with its own index route
const Tab1Content: React.FC = () => {
  return (
    <IonPage data-pageid="irr-tab1-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1 Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="irr-tab1-home-content">Tab 1 Index Route Content</div>
        <IonButton routerLink="/index-route-reuse/tab1/detail" id="irr-tab1-detail-btn">
          Go to Tab 1 Detail
        </IonButton>
        <TestDescription>Switch between all three tabs and verify each shows its own content ("Tab 1 Index Route Content", "Tab 2 Index Route Content", "Tab 3 Index Route Content"). Navigate to a detail page within a tab, switch tabs, then switch back -- the detail page should be preserved. If a tab shows another tab's content or goes blank, the test fails.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

const Tab1Detail: React.FC = () => {
  return (
    <IonPage data-pageid="irr-tab1-detail">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/index-route-reuse/tab1" />
          </IonButtons>
          <IonTitle>Tab 1 Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="irr-tab1-detail-content">Tab 1 Detail Content</div>
      </IonContent>
    </IonPage>
  );
};

const Tab1Outlet: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route index element={<Tab1Content />} />
        <Route path="detail" element={<Tab1Detail />} />
      </IonRouterOutlet>
    </IonPage>
  );
};

// Tab 2 nested outlet with its own index route
const Tab2Content: React.FC = () => {
  return (
    <IonPage data-pageid="irr-tab2-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2 Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="irr-tab2-home-content">Tab 2 Index Route Content</div>
        <IonButton routerLink="/index-route-reuse/tab2/detail" id="irr-tab2-detail-btn">
          Go to Tab 2 Detail
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const Tab2Detail: React.FC = () => {
  return (
    <IonPage data-pageid="irr-tab2-detail">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/index-route-reuse/tab2" />
          </IonButtons>
          <IonTitle>Tab 2 Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="irr-tab2-detail-content">Tab 2 Detail Content</div>
      </IonContent>
    </IonPage>
  );
};

const Tab2Outlet: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route index element={<Tab2Content />} />
        <Route path="detail" element={<Tab2Detail />} />
      </IonRouterOutlet>
    </IonPage>
  );
};

// Tab 3 nested outlet with its own index route
const Tab3Content: React.FC = () => {
  return (
    <IonPage data-pageid="irr-tab3-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3 Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="irr-tab3-home-content">Tab 3 Index Route Content</div>
      </IonContent>
    </IonPage>
  );
};

const Tab3Outlet: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route index element={<Tab3Content />} />
      </IonRouterOutlet>
    </IonPage>
  );
};

// Main tabs component
const IndexRouteReuse: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="tab1/*" element={<Tab1Outlet />} />
        <Route path="tab2/*" element={<Tab2Outlet />} />
        <Route path="tab3/*" element={<Tab3Outlet />} />
        <Route index element={<Navigate to="tab1" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/index-route-reuse/tab1">
          <IonIcon icon={triangle} />
          <IonLabel>Tab 1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/index-route-reuse/tab2">
          <IonIcon icon={ellipse} />
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/index-route-reuse/tab3">
          <IonIcon icon={square} />
          <IonLabel>Tab 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default IndexRouteReuse;
