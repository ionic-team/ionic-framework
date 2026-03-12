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
import { Route, useLocation, useParams } from 'react-router-dom';

/**
 * Test page for tail-slice ambiguity in derivePathnameToMatch.
 *
 * Route structure:
 *   /tail-slice-ambiguity/*
 *     └── <IonRouterOutlet>
 *           ├── index → ListPage
 *           ├── details/:id → DetailsPage
 *           └── * → CatchAllPage
 *
 * Bug scenario:
 *   1. Navigate to /tail-slice-ambiguity/details/42 → creates details/:id view
 *   2. Navigate to /tail-slice-ambiguity/extra/details/99
 *   3. derivePathnameToMatch tail-slices the last 2 segments ["details", "99"]
 *      and matchComponent falsely matches details/:id
 *   4. The catch-all * view is incorrectly deactivated because hasSpecificMatch
 *      finds the false positive from details/:id
 *   5. User sees nothing instead of the catch-all page
 */
const TailSliceAmbiguity: React.FC = () => (
  <IonRouterOutlet id="tail-slice-outlet">
    <Route index element={<ListPage />} />
    <Route path="details/:id" element={<DetailsPage />} />
    <Route path="*" element={<CatchAllPage />} />
  </IonRouterOutlet>
);

const ListPage: React.FC = () => (
  <IonPage data-pageid="tail-slice-list">
    <IonHeader>
      <IonToolbar>
        <IonTitle>List</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonButton routerLink="/tail-slice-ambiguity/details/42" id="go-to-details">
        Details 42
      </IonButton>
      <IonButton routerLink="/tail-slice-ambiguity/extra/details/99" id="go-to-ambiguous">
        Ambiguous Path
      </IonButton>
    </IonContent>
  </IonPage>
);

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <IonPage data-pageid="tail-slice-details">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="details-id">Details ID: {id}</IonLabel>
        <IonButton routerLink="/tail-slice-ambiguity" id="back-to-list">
          Back to List
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const CatchAllPage: React.FC = () => {
  const location = useLocation();
  return (
    <IonPage data-pageid="tail-slice-catchall">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Catch All</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel data-testid="catchall-path">Catch-all: {location.pathname}</IonLabel>
        <IonButton routerLink="/tail-slice-ambiguity" id="catchall-back-to-list">
          Back to List
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default TailSliceAmbiguity;
