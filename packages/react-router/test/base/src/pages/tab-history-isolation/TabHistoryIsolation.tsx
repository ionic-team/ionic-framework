import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/react';
import { triangle, square, ellipse } from 'ionicons/icons';
import React from 'react';
import { Route, Navigate } from 'react-router';

const TabHistoryIsolation: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet id="tab-history-isolation">
        <Route index element={<Navigate to="/tab-history-isolation/a" replace />} />
        <Route path="a" element={<TabA />} />
        <Route path="b" element={<TabB />} />
        <Route path="c" element={<TabC />} />
        <Route path="a/details" element={<TabADetails />} />
        <Route path="b/details" element={<TabBDetails />} />
        <Route path="c/details" element={<TabCDetails />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab-a" href="/tab-history-isolation/a">
          <IonIcon icon={triangle} />
          <IonLabel>Tab A</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab-b" href="/tab-history-isolation/b">
          <IonIcon icon={square} />
          <IonLabel>Tab B</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab-c" href="/tab-history-isolation/c">
          <IonIcon icon={ellipse} />
          <IonLabel>Tab C</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const TabA = () => {
  return (
    <IonPage data-pageid="tab-a">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Tab A</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        Tab A
        <IonButton routerLink="/tab-history-isolation/a/details" id="go-to-a-details">
          Go to A Details
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const TabB = () => {
  return (
    <IonPage data-pageid="tab-b">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Tab B</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        Tab B
        <IonButton routerLink="/tab-history-isolation/b/details" id="go-to-b-details">
          Go to B Details
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const TabC = () => {
  return (
    <IonPage data-pageid="tab-c">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Tab C</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        Tab C
        <IonButton routerLink="/tab-history-isolation/c/details" id="go-to-c-details">
          Go to C Details
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

const TabADetails = () => {
  return (
    <IonPage data-pageid="tab-a-details">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Tab A Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>Tab A Details</IonContent>
    </IonPage>
  );
};

const TabBDetails = () => {
  return (
    <IonPage data-pageid="tab-b-details">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Tab B Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>Tab B Details</IonContent>
    </IonPage>
  );
};

const TabCDetails = () => {
  return (
    <IonPage data-pageid="tab-c-details">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Tab C Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>Tab C Details</IonContent>
    </IonPage>
  );
};

export default TabHistoryIsolation;
