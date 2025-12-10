import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import React from 'react';

import packageJson from '../../package.json';

const Main: React.FC = () => {
  const majorVersion = packageJson.dependencies['react-router'].match(
    /(\d+)\.(\d+)\.(\d+)/
  )?.[1];

  return (
    <IonPage data-pageid="home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Test App - React Router v{majorVersion}</IonTitle>
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
          <IonItem routerLink="/refs">
            <IonLabel>Refs</IonLabel>
          </IonItem>
          <IonItem routerLink="/overlays">
            <IonLabel>Overlays</IonLabel>
          </IonItem>
          <IonItem routerLink="/tabs" id="go-to-tabs">
            <IonLabel>Tabs</IonLabel>
          </IonItem>
          <IonItem routerLink="/tab-history-isolation">
            <IonLabel>Tab History Isolation</IonLabel>
          </IonItem>
          <IonItem routerLink="/params/0">
            <IonLabel>Params</IonLabel>
          </IonItem>
          <IonItem routerLink="/nested-params">
            <IonLabel>Nested Params</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Main;
