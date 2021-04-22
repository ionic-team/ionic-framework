import React from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';

interface MainProps {
  swapMountedRouter: () => any
}

const Main: React.FC<MainProps> = ({ swapMountedRouter }) => {
  return (
    <IonPage data-pageid="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Main</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/routing">
            <IonLabel>Routing</IonLabel>
          </IonItem>
          <IonItem routerLink="/dynamic-routes">
            <IonLabel>Dynamic Routes</IonLabel>
          </IonItem>
          <IonItem routerLink="/multiple-tabs">
            <IonLabel>Multiple Tabs</IonLabel>
          </IonItem>
          <IonItem routerLink="/dynamic-tabs">
            <IonLabel>Dynamic Tabs</IonLabel>
          </IonItem>
          <IonItem routerLink="/nested-outlet">
            <IonLabel>Nested Outlet</IonLabel>
          </IonItem>
          <IonItem routerLink="/nested-outlet2">
            <IonLabel>Nested Outlet 2</IonLabel>
          </IonItem>
          <IonItem routerLink="/replace-action">
            <IonLabel>Replace Action</IonLabel>
          </IonItem>
          <IonItem routerLink="/tab-context">
            <IonLabel>Tab Context</IonLabel>
          </IonItem>
          <IonItem routerLink="/outlet-ref">
            <IonLabel>Outlet Ref</IonLabel>
          </IonItem>
          <IonItem routerLink="/swipe-to-go-back">
            <IonLabel>Swipe to go back</IonLabel>
          </IonItem>
          <IonItem routerLink="/dynamic-ionpage-classnames">
            <IonLabel>Dynamic IonPage Classnames</IonLabel>
          </IonItem>
          <IonItem routerLink="/Refs">
            <IonLabel>Refs</IonLabel>
          </IonItem>
          <IonItem>
            <IonButton onClick={swapMountedRouter}>Swap Mounted Router</IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Main;
