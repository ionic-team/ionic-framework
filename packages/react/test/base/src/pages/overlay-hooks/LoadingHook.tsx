import React from 'react';
import { IonButton, IonContent, IonPage, useIonLoading } from '@ionic/react';

interface LoadingProps {}

const LoadingHook: React.FC<LoadingProps> = () => {
  const [present, dismiss] = useIonLoading();
  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={() =>
            present({
              duration: 1000,
              message: 'Loading',
            })
          }
        >
          Show Loading with options
        </IonButton>
        <IonButton expand="block" onClick={() => present('Loading', 1000, 'dots')}>
          Show Loading with params
        </IonButton>
        <IonButton
          expand="block"
          onClick={() => {
            present('Loading', 10000, 'dots');
            setTimeout(dismiss, 250);
          }}
        >
          Show Loading, hide after 250 ms
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoadingHook;
