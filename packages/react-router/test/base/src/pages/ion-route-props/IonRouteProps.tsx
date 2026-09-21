import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  IonRoute,
} from '@ionic/react';
import React from 'react';
import { Route } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Test page for IonRoute index and caseSensitive props.
 *
 * Verifies that:
 * 1. <IonRoute index> renders as the default when navigating to the parent path
 * 2. <IonRoute caseSensitive> correctly enforces case-sensitive path matching
 */

const IndexHome: React.FC = () => (
  <IonPage data-pageid="index-home">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Index Home</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <p id="index-home-text">This is the index route</p>
      <IonButton id="go-to-details" routerLink="/ion-route-props/details">
        Go to Details
      </IonButton>
      <TestDescription>This page should render as the default (index) route when navigating to /ion-route-props. Navigate to Details and back to verify forward/back works. Manually visit /ion-route-props/CaseSensitive (exact case) -- it should match. Visit /ion-route-props/casesensitive (lowercase) -- it should fall through to this index page instead.</TestDescription>
    </IonContent>
  </IonPage>
);

const Details: React.FC = () => (
  <IonPage data-pageid="ion-route-details">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Details</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <p id="details-text">Details page</p>
      <IonButton id="go-back-home" routerLink="/ion-route-props" routerDirection="back">
        Back to Home
      </IonButton>
    </IonContent>
  </IonPage>
);

const CaseSensitivePage: React.FC = () => (
  <IonPage data-pageid="case-sensitive-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Case Sensitive Match</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <p id="case-sensitive-text">Matched case-sensitive route</p>
    </IonContent>
  </IonPage>
);

const IonRoutePropsTest: React.FC = () => (
  <IonRouterOutlet>
    {/* Index route: should render when navigating to /ion-route-props */}
    <IonRoute index element={<IndexHome />} />
    <IonRoute path="details" element={<Details />} />
    <IonRoute path="CaseSensitive" caseSensitive element={<CaseSensitivePage />} />
    {/* Catch-all for unmatched routes */}
    <Route path="*" element={<IndexHome />} />
  </IonRouterOutlet>
);

export default IonRoutePropsTest;
