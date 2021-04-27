import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1 DOUBLE Nested</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1 DOUBLE  Nested</IonTitle>
          </IonToolbar>
        </IonHeader>
          <h1>This page is doubled nested!</h1>
          <p>Pressing back should bring it back to the single nested page, not tab1</p>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
