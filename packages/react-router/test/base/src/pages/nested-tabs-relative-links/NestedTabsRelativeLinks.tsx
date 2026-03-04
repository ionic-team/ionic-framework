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
 * This test page verifies that relative links work correctly within
 * nested IonRouterOutlet components, specifically in a tabs-based layout.
 *
 * Issue: When using React Router's <Link to="page-a"> inside the tab1 route
 * with nested outlets and index routes, the relative path resolution can produce
 * incorrect URLs (e.g., /tab1/tab1/page-a instead of /tab1/page-a).
 *
 * This test also verifies that absolute links work when a catch-all route
 * is present.
 */

// Tab content with relative links for testing
const Tab1Content: React.FC = () => {
  return (
    <IonPage data-pageid="nested-tabs-relative-tab1">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="tab1-content">
          <p>Tab 1 - Home Page</p>
          {/* Relative link - should navigate to /nested-tabs-relative-links/tab1/page-a */}
          <Link to="page-a" data-testid="link-relative-page-a">
            Go to Page A (relative)
          </Link>
          <br />
          {/* Absolute link - should also work */}
          <Link to="/nested-tabs-relative-links/tab1/page-a" data-testid="link-absolute-page-a">
            Go to Page A (absolute)
          </Link>
          <br />
          {/* Another relative link */}
          <Link to="page-b" data-testid="link-relative-page-b">
            Go to Page B (relative)
          </Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

const PageA: React.FC = () => {
  return (
    <IonPage data-pageid="nested-tabs-relative-page-a">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/nested-tabs-relative-links/tab1" />
          </IonButtons>
          <IonTitle>Page A</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="page-a-content">
          This is Page A within Tab 1
        </div>
      </IonContent>
    </IonPage>
  );
};

const PageB: React.FC = () => {
  return (
    <IonPage data-pageid="nested-tabs-relative-page-b">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/nested-tabs-relative-links/tab1" />
          </IonButtons>
          <IonTitle>Page B</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="page-b-content">
          This is Page B within Tab 1
        </div>
      </IonContent>
    </IonPage>
  );
};

// Nested router outlet for Tab 1 - similar to user's RouterOutletTab1
const Tab1RouterOutlet: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route index element={<Tab1Content />} />
      <Route path="page-a" element={<PageA />} />
      <Route path="page-b" element={<PageB />} />
    </IonRouterOutlet>
  );
};

const Tab2Content: React.FC = () => {
  return (
    <IonPage data-pageid="nested-tabs-relative-tab2">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="tab2-content">
          Tab 2 Content
        </div>
      </IonContent>
    </IonPage>
  );
};

const Tab3Content: React.FC = () => {
  return (
    <IonPage data-pageid="nested-tabs-relative-tab3">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="tab3-content">
          Tab 3 Content
        </div>
      </IonContent>
    </IonPage>
  );
};

// Main tabs component - wraps tabs with catch-all route (similar to user's reproduction)
const TabsContainer: React.FC = () => (
    <IonTabs>
      <IonRouterOutlet>
        {/* Tab 1 has nested routes with index route */}
        <Route path="tab1/*" element={<Tab1RouterOutlet />} />
        <Route path="tab2" element={<Tab2Content />} />
        <Route path="tab3" element={<Tab3Content />} />
        <Route index element={<Navigate to="tab1" replace />} />
        {/* Catch-all 404 route - this presence caused issues with absolute links */}
        <Route
          path="*"
          element={
            <IonPage data-pageid="nested-tabs-relative-404">
              <IonContent>
                <p data-testid="not-found">404 - Not Found</p>
              </IonContent>
            </IonPage>
          }
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/nested-tabs-relative-links/tab1">
          <IonIcon icon={triangle} />
          <IonLabel>Tab 1</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/nested-tabs-relative-links/tab2">
          <IonIcon icon={ellipse} />
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/nested-tabs-relative-links/tab3">
          <IonIcon icon={square} />
          <IonLabel>Tab 3</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
);

// Top-level component - splat route renders tabs
const NestedTabsRelativeLinks: React.FC = () => (
  <IonRouterOutlet>
    <Route path="*" element={<TabsContainer />} />
  </IonRouterOutlet>
);

export default NestedTabsRelativeLinks;
