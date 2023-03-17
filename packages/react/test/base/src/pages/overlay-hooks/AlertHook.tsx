import React, { useState } from 'react';
import { IonButton, IonContent, IonPage, useIonAlert } from '@ionic/react';

const AlertHook: React.FC = () => {
  const [present, dismiss] = useIonAlert();
  const [message, setMessage] = useState('');

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonButton
          expand="block"
          onClick={() =>
            present({
              cssClass: 'my-css',
              header: 'Alert',
              message: 'alert from hook',
              buttons: ['Cancel', { text: 'Ok', handler: (d) => setMessage('Ok clicked') }],
            })
          }
        >
          Show Alert with options
        </IonButton>
        <IonButton
          expand="block"
          onClick={() =>
            present('Hello!', [{ text: 'Ok', handler: (d) => setMessage('Ok clicked') }])
          }
        >
          Show Alert with params
        </IonButton>
        <IonButton
          expand="block"
          onClick={() => {
            present('Hello!', [{ text: 'Ok', handler: (d) => setMessage('Ok clicked') }]);
            setTimeout(dismiss, 250);
          }}
        >
          Show Alert, hide after 250 ms
        </IonButton>
        <div>{message}</div>
      </IonContent>
    </IonPage>
  );
};

export default AlertHook;
