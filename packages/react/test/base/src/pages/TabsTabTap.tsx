import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { Navigate, Route } from 'react-router';

const HomePage: React.FC = () => (
  <IonPage data-testid="home-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Home</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonItem routerLink="/tabs-tab-tap/home/detail" data-testid="detail-link">
        <IonLabel>Detail</IonLabel>
      </IonItem>
      <div style={{ height: '3000px' }}>Home Content</div>
    </IonContent>
  </IonPage>
);

const HomeDetailPage: React.FC = () => (
  <IonPage data-testid="home-detail-page">
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/tabs-tab-tap/home" />
        </IonButtons>
        <IonTitle>Detail</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div style={{ height: '3000px' }}>Detail Content</div>
    </IonContent>
  </IonPage>
);

const TabsTabTap: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route index element={<Navigate to="/tabs-tab-tap/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="home/detail" element={<HomeDetailPage />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs-tab-tap/home" data-testid="home-tab">
          <IonLabel>Home</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsTabTap;
