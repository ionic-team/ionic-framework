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
      </IonContent>
    </IonPage>
  );
};

export default TabLifecycleOutside;
