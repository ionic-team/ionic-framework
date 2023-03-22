import React, { useState } from 'react';
import { IonButton, IonContent, IonPage, IonAlert } from '@ionic/react';

const AlertComponent: React.FC = () => {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonAlert
          isOpen={show}
          cssClass="my-css"
          header="Alert"
          message="alert from hook"
          buttons={['Cancel', { text: 'Ok', handler: (d) => setMessage('Ok clicked') }]}
          onDidDismiss={() => setShow(false)}
        />
        <IonButton expand="block" onClick={() => setShow(true)}>
          Show Alert
        </IonButton>
        <IonButton
          expand="block"
          onClick={() => {
            setShow(true);
            setTimeout(() => setShow(false), 250);
          }}
        >
          Show Alert, hide after 250 ms
        </IonButton>
        <div>{message}</div>
      </IonContent>
    </IonPage>
  );
};

export default AlertComponent;
