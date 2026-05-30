import React from 'react';
import { IonButton, IonContent, IonPage, useIonToast } from '@ionic/react';

const ToastHook: React.FC = () => {
  const [present, dismiss] = useIonToast();

  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={() =>
            present({
              buttons: [{ text: 'hide', handler: () => dismiss() }],
              message: 'toast from hook, click hide to dismiss',
              onDidDismiss: () => console.log('dismissed'),
              onWillDismiss: () => console.log('will dismiss'),
            })
          }
        >
          Show Toast with options
        </IonButton>
        <IonButton expand="block" onClick={() => present('Hello from a toast!', 250)}>
          Show Toast Hook with params, closes in 250 ms
        </IonButton>
        <IonButton
          expand="block"
          onClick={() => {
            present('Hello from a toast!');
            setTimeout(dismiss, 250);
          }}
        >
          Show Toast Hook with params, call dismiss in 250 ms
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ToastHook;
