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

import TestDescription from '../../components/TestDescription';

export const SwipeToGoBack: React.FC = () => {
  return (
    <IonRouterOutlet id="swipe-to-go-back">
      <Route path="/swipe-to-go-back" element={<Main />} />
      <Route path="/swipe-to-go-back/details" element={<Details />} />
      <Route path="/swipe-to-go-back/details2" element={<Details2 />} />
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
        <TestDescription>Navigate to Details, then Details 2. Swipe from the left edge of the screen to go back. Each swipe should show a smooth slide animation with no blank flash, revealing the correct previous page.</TestDescription>
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
        <IonItem routerLink="/swipe-to-go-back/details2" id="go-to-details2">Details 2</IonItem>
      </IonContent>
    </IonPage>
  );
};

const Details2: React.FC = () => {
  return (
    <IonPage data-pageid="details2">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Details 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Details 2</div>
      </IonContent>
    </IonPage>
  );
};

export const SwipeToGoBackDisabled: React.FC = () => {
  return (
    <IonRouterOutlet id="swipe-to-go-back-disabled" swipeGesture={false}>
      <Route path="/swipe-to-go-back-disabled" element={<DisabledMain />} />
      <Route path="/swipe-to-go-back-disabled/details" element={<DisabledDetails />} />
    </IonRouterOutlet>
  );
};

const DisabledMain: React.FC = () => {
  return (
    <IonPage data-pageid="disabled-main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Disabled Main</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem routerLink="/swipe-to-go-back-disabled/details">Details</IonItem>
        <TestDescription>Navigate to Details and try swiping from the left edge. The swipe gesture should be disabled -- the page should not move or go back.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

const DisabledDetails: React.FC = () => {
  return (
    <IonPage data-pageid="disabled-details">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Disabled Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Details (swipe disabled)</div>
      </IonContent>
    </IonPage>
  );
};
