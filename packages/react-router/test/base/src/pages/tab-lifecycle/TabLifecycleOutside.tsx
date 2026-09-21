import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import React from 'react';

import TestDescription from '../../components/TestDescription';

const TabLifecycleOutside: React.FC = () => {
  return (
    <IonPage data-pageid="tab-lifecycle-outside">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab-lifecycle/home" />
          </IonButtons>
          <IonTitle>Outside Tabs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton routerLink="/tab-lifecycle/home" id="go-back-to-tabs">
          Back to Tabs
        </IonButton>
        <TestDescription>This page is outside the tabs context. Navigating here from a tab should fire ionViewWillLeave/ionViewDidLeave on the tab. Going back to tabs should fire ionViewWillEnter/ionViewDidEnter on the returning tab.</TestDescription>
      </IonContent>
    </IonPage>
  );
};

export default TabLifecycleOutside;
