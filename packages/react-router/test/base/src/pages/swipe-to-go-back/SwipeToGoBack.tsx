import {
  IonRouterOutlet,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';

export const SwipeToGoBack: React.FC = () => {
  return (
    <IonRouterOutlet id="swipe-to-go-back">
      <Route path="/swipe-to-go-back" element={<Main />} />
      <Route path="/swipe-to-go-back/details" element={<Details />} />
    </IonRouterOutlet>
  );
};

const Main: React.FC = () => {
  return (
    <IonPage data-pageid="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Main</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem routerLink="/swipe-to-go-back/details">Details</IonItem>
      </IonContent>
    </IonPage>
  );
};

const Details: React.FC = () => {
  return (
    <IonPage data-pageid="details">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Details</div>
      </IonContent>
    </IonPage>
  );
};
