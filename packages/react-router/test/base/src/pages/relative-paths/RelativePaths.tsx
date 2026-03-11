import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
  IonList,
  IonItem,
  IonLabel,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';

/**
 * This test page verifies that IonRouterOutlet correctly handles
 * relative paths (paths without a leading slash) the same way
 * React Router 6's Routes component does.
 */

const RelativePathsHome: React.FC = () => {
  return (
    <IonPage data-pageid="relative-paths-home">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Relative Paths Test</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/relative-paths/page-a">
            <IonLabel>Go to Page A (absolute path route)</IonLabel>
          </IonItem>
          <IonItem routerLink="/relative-paths/page-b">
            <IonLabel>Go to Page B (relative path route)</IonLabel>
          </IonItem>
          <IonItem routerLink="/relative-paths/unknown-page">
            <IonLabel>Go to Unknown Page (catch-all route)</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

const PageA: React.FC = () => {
  return (
    <IonPage data-pageid="relative-paths-page-a">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/relative-paths" />
          </IonButtons>
          <IonTitle>Page A</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="page-a-content">
          This is Page A - route defined with absolute path
        </div>
      </IonContent>
    </IonPage>
  );
};

const PageB: React.FC = () => {
  return (
    <IonPage data-pageid="relative-paths-page-b">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/relative-paths" />
          </IonButtons>
          <IonTitle>Page B</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="page-b-content">
          This is Page B - route defined with relative path (no leading slash)
        </div>
      </IonContent>
    </IonPage>
  );
};

const CatchAllPage: React.FC = () => {
  return (
    <IonPage data-pageid="relative-paths-catch-all">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/relative-paths" />
          </IonButtons>
          <IonTitle>Not Found</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="catch-all-content">
          This page was not found - caught by relative * route
        </div>
      </IonContent>
    </IonPage>
  );
};

const RelativePaths: React.FC = () => {
  return (
    <IonRouterOutlet>
      {/* Route with absolute path (has leading slash) - this should work */}
      <Route path="/relative-paths/page-a" element={<PageA />} />

      {/* Route with relative path (no leading slash) */}
      <Route path="page-b" element={<PageB />} />

      {/* Catch-all route - using relative wildcard */}
      <Route path="*" element={<CatchAllPage />} />

      {/* Home route - using relative path */}
      <Route path="" element={<RelativePathsHome />} />
    </IonRouterOutlet>
  );
};

export default RelativePaths;
