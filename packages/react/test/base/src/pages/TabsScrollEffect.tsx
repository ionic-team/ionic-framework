import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
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
        <IonButtons slot="end">
          <IonButton routerLink="/tabs-scroll-effect/home/child" data-testid="go-child">
            Child
          </IonButton>
          <IonButton routerLink="/tabs-scroll-effect/home/child-effect" data-testid="go-child-effect">
            Child with tabBarScrollEffect
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div style={{ height: '3000px' }}>Home Content</div>
    </IonContent>
  </IonPage>
);

interface ChildPageProps {
  testId: string;
  tabBarScrollEffect?: boolean;
}

const ChildPage: React.FC<ChildPageProps> = ({ testId, tabBarScrollEffect }) => (
  <IonPage data-testid={testId}>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/tabs-scroll-effect/home" />
        </IonButtons>
        <IonTitle>Child</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent tabBarScrollEffect={tabBarScrollEffect}>
      <div style={{ height: '3000px' }}>Child Content</div>
    </IonContent>
  </IonPage>
);

const OtherPage: React.FC = () => (
  <IonPage data-testid="other-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Other</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div style={{ height: '3000px' }}>Other Content</div>
    </IonContent>
  </IonPage>
);

const TabsScrollEffect: React.FC = () => {
  // Open the page with ?effect=fade to use the fade scroll effect instead of hide
  const effect = new URLSearchParams(window.location.search).get('effect') === 'fade' ? 'fade' : 'hide';

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route index element={<Navigate to="/tabs-scroll-effect/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="home/child" element={<ChildPage testId="child-page" />} />
        <Route path="home/child-effect" element={<ChildPage testId="child-effect-page" tabBarScrollEffect />} />
        <Route path="other" element={<OtherPage />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" scrollEffect={effect}>
        <IonTabButton tab="home" href="/tabs-scroll-effect/home" data-testid="home-tab">
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="other" href="/tabs-scroll-effect/other" data-testid="other-tab">
          <IonLabel>Other</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsScrollEffect;
