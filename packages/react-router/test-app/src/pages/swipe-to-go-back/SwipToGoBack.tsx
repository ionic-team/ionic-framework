import React from 'react';
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
import { Route } from 'react-router';

interface SwipeToGoBackProps {}

export const SwipeToGoBack: React.FC<SwipeToGoBackProps> = () => {
  return (
    <IonRouterOutlet id="swipe-to-go-back">
      <Route path="/swipe-to-go-back" component={Main} exact />
      <Route path="/swipe-to-go-back/details" component={Details} />
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
          <IonButtons>
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
