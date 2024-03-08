import React, { useState } from 'react';
import { IonButton, IonContent, IonPage, IonToast } from '@ionic/react';

const ToastComponent: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <IonPage>
      <IonContent>
        <IonToast
          isOpen={show}
          buttons={[{ text: 'hide', handler: () => setShow(false) }]}
          message="Hello from a toast!"
          onDidDismiss={() => setShow(false)}
        />
        <IonButton expand="block" onClick={() => setShow(true)}>
          Show Toast
        </IonButton>

        <IonButton
          expand="block"
          onClick={() => {
            setShow(true);
            setTimeout(() => setShow(false), 250);
          }}
        >
          Show Toast, call dismiss in 250 ms
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ToastComponent;
