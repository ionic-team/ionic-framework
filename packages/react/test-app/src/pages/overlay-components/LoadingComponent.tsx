import React, { useState } from 'react';
import { IonButton, IonContent, IonPage, IonLoading } from '@ionic/react';

interface LoadingProps {}

const LoadingComponent: React.FC<LoadingProps> = () => {
  const [show, setShow] = useState(false);
  return (
    <IonPage>
      <IonContent>
        <IonLoading
          isOpen={show}
          duration={1000}
          message="Loading"
          onDidDismiss={() => setShow(false)}
        />

        <IonButton expand="block" onClick={() => setShow(true)}>
          Show Loading with options
        </IonButton>

        <IonButton
          expand="block"
          onClick={() => {
            setShow(true);
            setTimeout(() => setShow(false), 250);
          }}
        >
          Show Loading, hide after 250 ms
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LoadingComponent;
