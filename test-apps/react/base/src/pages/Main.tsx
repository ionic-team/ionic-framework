import React from 'react';
import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
} from '@ionic/react';

interface MainProps {}

const Main: React.FC<MainProps> = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ionic React Test App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem routerLink="/overlay-hooks">
            <IonLabel>Overlay Hooks</IonLabel>
          </IonItem>
          <IonItem routerLink="/overlay-components">
            <IonLabel>Overlay Components</IonLabel>
          </IonItem>
          <IonItem routerLink="/keep-contents-mounted">
            <IonLabel>Keep Contents Mounted Overlay Components</IonLabel>
          </IonItem>
          <IonItem routerLink="/navigation">
            <IonLabel>Navigation</IonLabel>
          </IonItem>
          <IonItem routerLink="/tabs">
            <IonLabel>Tabs</IonLabel>
          </IonItem>
          <IonItem routerLink="/icons">
            <IonLabel>Icons</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Main;
