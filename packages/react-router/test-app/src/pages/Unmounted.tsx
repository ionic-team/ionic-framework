import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonList,
  IonItem,
  IonButton,
} from '@ionic/react';

interface UnmountedProps {
  swapMountedRouter: () => any
}

const Unmounted: React.FC<UnmountedProps> = ({ swapMountedRouter }) => {
  return (
    <IonPage data-pageid="unmounted">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Unmounted</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>The main IonReactRouter was unmounted and swapped with another. Press below to swap back.</IonLabel>
          </IonItem>
          <IonItem>
            <IonButton onClick={swapMountedRouter}>Swap Mounted Router</IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Unmounted;
