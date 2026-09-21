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
  IonTitle,
  IonContent,
  IonButton,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { triangle, square } from 'ionicons/icons';
import React from 'react';
import { Route, Navigate } from 'react-router';

import TestDescription from '../../components/TestDescription';

const pushEvent = (event: string) => {
  (window as any).lifecycleEvents = (window as any).lifecycleEvents || [];
  (window as any).lifecycleEvents.push(event);
};

const TabLifecycle: React.FC = () => {
  return (
    <IonTabs data-pageid="tab-lifecycle">
      <IonRouterOutlet id="tab-lifecycle">
        <Route index element={<Navigate to="/tab-lifecycle/home" replace />} />
        <Route path="home" element={<HomeTab />} />
        <Route path="settings" element={<SettingsTab />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tab-lifecycle/home">
          <IonIcon icon={triangle} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/tab-lifecycle/settings">
          <IonIcon icon={square} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const HomeTab: React.FC = () => {
  useIonViewWillEnter(() => pushEvent('home:ionViewWillEnter'));
  useIonViewDidEnter(() => pushEvent('home:ionViewDidEnter'));
  useIonViewWillLeave(() => pushEvent('home:ionViewWillLeave'));
  useIonViewDidLeave(() => pushEvent('home:ionViewDidLeave'));

  return (
    <IonPage data-pageid="tab-lifecycle-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home Tab</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/tab-lifecycle-outside" id="go-outside">
          Go Outside Tabs
        </IonButton>
        <TestDescription>Switch between Home and Settings tabs and navigate outside tabs. Check the browser console for lifecycle events (ionViewWillEnter, ionViewDidEnter, ionViewWillLeave, ionViewDidLeave). Events should fire in the correct order on each transition and not fire spuriously.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

const SettingsTab: React.FC = () => {
  useIonViewWillEnter(() => pushEvent('settings:ionViewWillEnter'));
  useIonViewDidEnter(() => pushEvent('settings:ionViewDidEnter'));
  useIonViewWillLeave(() => pushEvent('settings:ionViewWillLeave'));
  useIonViewDidLeave(() => pushEvent('settings:ionViewDidLeave'));

  return (
    <IonPage data-pageid="tab-lifecycle-settings">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings Tab</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/tab-lifecycle-outside" id="go-outside-settings">
          Go Outside Tabs
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default TabLifecycle;
