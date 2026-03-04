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
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { triangle, ellipse, square } from 'ionicons/icons';
import React from 'react';
import { Link, Navigate, Route } from 'react-router-dom';

/**
 * Test page for root-level splat routes with relative tab paths.
 *
 * Structure: Outer splat route "*" renders IonTabs, with relative paths
 * like "tab1/*" (no leading slash) inside the tabs outlet.
 *
 * This tests the fix for routes with relative paths inside root-level splat routes.
 */

// Tab content with relative links for testing
const Tab1Content: React.FC = () => {
  return (
    <IonPage data-pageid="root-splat-tab1">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="root-splat-tab1-content">
          <p>Tab 1 - Home Page (Root Splat Test)</p>
          <Link to="page-a" data-testid="link-relative-page-a">
            Go to Page A (relative)
          </Link>
          <br />
          <Link to="/root-splat-tabs/tab1/page-a" data-testid="link-absolute-page-a">
            Go to Page A (absolute)
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

const PageA: React.FC = () => {
  return (
    <IonPage data-pageid="root-splat-page-a">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/root-splat-tabs/tab1" />
          </IonButtons>
          <IonTitle>Page A</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="root-splat-page-a-content">
          This is Page A within Tab 1 (Root Splat Test)
        </div>
      </IonContent>
    </IonPage>
  );
};

// Nested router outlet for Tab 1 - matches customer's RouterOutletTab1
const Tab1RouterOutlet: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet>
        <Route index element={<Tab1Content />} />
        <Route path="page-a" element={<PageA />} />
      </IonRouterOutlet>
    </IonPage>
  );
};

const Tab2Content: React.FC = () => {
  return (
    <IonPage data-pageid="root-splat-tab2">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="root-splat-tab2-content">
          Tab 2 Content (Root Splat Test)
        </div>
      </IonContent>
    </IonPage>
  );
};

const Tab3Content: React.FC = () => {
  return (
    <IonPage data-pageid="root-splat-tab3">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="root-splat-tab3-content">
          Tab 3 Content (Root Splat Test)
        </div>
      </IonContent>
    </IonPage>
  );
};

const NotFoundPage: React.FC = () => {
  return (
    <IonPage data-pageid="root-splat-404">
      <IonContent>
        <p data-testid="root-splat-not-found">404 - Not Found (Root Splat Test)</p>
      </IonContent>
    </IonPage>
  );
};

// Tabs rendered directly inside a catch-all splat route
const TabsWithSplatRoutes: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        {/* Using RELATIVE path "tab1/*" (no leading slash) - the key test case */}
        <Route path="tab1/*" element={<Tab1RouterOutlet />} />
        <Route path="tab2" element={<Tab2Content />} />
        <Route path="tab3" element={<Tab3Content />} />
        <Route index element={<Navigate to="tab1" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/root-splat-tabs/tab1">
          <IonIcon icon={triangle} />
          <IonLabel>Tab 1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/root-splat-tabs/tab2">
          <IonIcon icon={ellipse} />
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/root-splat-tabs/tab3">
          <IonIcon icon={square} />
          <IonLabel>Tab 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

// Main component - renders tabs directly (no outlet wrapper)
const RootSplatTabs: React.FC = () => <TabsWithSplatRoutes />;

export default RootSplatTabs;
