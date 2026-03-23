import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import React from 'react';

/**
 * Test for issue #26394: routerLink should allow modifier key clicks (ctrl/cmd/shift)
 * to open links in a new tab without triggering SPA navigation on the current page.
 */

export const RouterLinkModifierClick: React.FC = () => {
  return (
    <IonPage data-pageid="router-link-modifier-click">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Router Link Modifier Click</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem id="nav-to-target" routerLink="/router-link-modifier-click/target">
          <IonLabel>Navigate to Target</IonLabel>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export const RouterLinkModifierClickTarget: React.FC = () => {
  return (
    <IonPage data-pageid="router-link-modifier-click-target">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/router-link-modifier-click" />
          </IonButtons>
          <IonTitle>Target Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Target Page</p>
      </IonContent>
    </IonPage>
  );
};
