import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonRouterOutlet,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

/**
 * Tests that IonBackButton works correctly after navigating with
 * routerDirection="none". The back button should use history to
 * determine the previous page, not fall back to defaultHref.
 */
const PageA: React.FC = () => {
  return (
    <IonPage data-pageid="direction-none-page-a">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Page A</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="go-forward" routerLink="/direction-none-back/b">
          Go to B (forward)
        </IonButton>
        <IonButton id="go-none" routerLink="/direction-none-back/b" routerDirection="none">
          Go to B (none)
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const PageB: React.FC = () => {
  return (
    <IonPage data-pageid="direction-none-page-b">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/direction-none-back/fallback" />
          </IonButtons>
          <IonTitle>Page B</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Page B content</p>
      </IonContent>
    </IonPage>
  );
};

const Fallback: React.FC = () => {
  return (
    <IonPage data-pageid="direction-none-fallback">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fallback (defaultHref)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>This page should NOT be reached via back button if history exists</p>
      </IonContent>
    </IonPage>
  );
};

const DirectionNoneBack: React.FC = () => {
  return (
    <IonRouterOutlet>
      <Route index element={<Navigate to="/direction-none-back/a" replace />} />
      <Route path="a" element={<PageA />} />
      <Route path="b" element={<PageB />} />
      <Route path="fallback" element={<Fallback />} />
    </IonRouterOutlet>
  );
};

export default DirectionNoneBack;
