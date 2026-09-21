import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';
import { useParams } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Test page for route specificity and priority:
 *
 * 1. Sort consistency: index routes should be prioritized over parameterized routes
 *    in both findRouteByRouteInfo (creation) and sortViewsBySpecificity (lookup).
 *
 * 2. Wildcard vs param matching: multi-segment paths like "deep/nested/path" should
 *    match the wildcard (*), NOT the single-param route (:slug). The :slug route
 *    should only match single-segment paths.
 *
 * Route configuration:
 *   <Route index />          (index route)
 *   <Route path=":slug" />   (single-param route)
 *   <Route path="*" />       (catch-all wildcard)
 */
const IndexParamPriority: React.FC = () => (
  <IonPage data-pageid="index-param-priority-root">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Index Param Priority</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonRouterOutlet id="index-param-priority-outlet">
        <Route index element={<IndexPage />} />
        <Route path=":slug" element={<SlugPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </IonRouterOutlet>
    </IonContent>
  </IonPage>
);

const IndexPage: React.FC = () => (
  <IonPage data-pageid="index-param-priority-index">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Index Page</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <IonLabel data-testid="index-page-label">This is the index page</IonLabel>
      <IonButton routerLink="/index-param-priority/hello" id="go-to-slug">
        Go to Slug "hello"
      </IonButton>
      <IonButton routerLink="/index-param-priority/world" id="go-to-slug-world">
        Go to Slug "world"
      </IonButton>
      <IonButton routerLink="/index-param-priority/deep/nested/path" id="go-to-wildcard">
        Go to Deep Path (wildcard)
      </IonButton>
      <TestDescription>This page should load as the index route (not the :slug route). Navigate to "hello" or "world" and verify the slug page displays the correct value. Navigate to "deep/nested/path" and verify it hits the wildcard "Not Found" page, not the slug page. Returning here should always show the index page.</TestDescription>
    </IonContent>
  </IonPage>
);

const SlugPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <IonPage data-pageid="index-param-priority-slug">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Slug: {slug}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLabel data-testid="slug-page-label">Slug page: {slug}</IonLabel>
        <IonButton routerLink="/index-param-priority" id="back-to-index">
          Back to Index
        </IonButton>
        <IonButton routerLink="/index-param-priority/world" id="go-to-another-slug">
          Go to Slug "world"
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const NotFoundPage: React.FC = () => (
  <IonPage data-pageid="index-param-priority-notfound">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Not Found</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <IonLabel data-testid="notfound-page-label">Page not found (wildcard catch-all)</IonLabel>
      <IonButton routerLink="/index-param-priority" id="back-to-index-from-notfound">
        Back to Index
      </IonButton>
    </IonContent>
  </IonPage>
);

export default IndexParamPriority;
