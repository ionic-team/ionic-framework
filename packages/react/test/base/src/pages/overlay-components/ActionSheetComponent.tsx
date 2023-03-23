import React from 'react';
import { IonButton, IonContent, IonPage, IonActionSheet } from '@ionic/react';
import { useState } from 'react';

const ActionSheetComponent: React.FC = () => {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  return (
    <IonPage>
      <IonContent>
        <IonActionSheet
          isOpen={show}
          buttons={[
            {
              text: 'Ok',
              handler: () => {
                setMessage('Ok clicked');
              },
            },
            {
              text: 'Cancel',
              handler: () => {
                setMessage('Cancel clicked');
              },
            },
          ]}
          header="Action Sheet"
          onDidDismiss={() => setShow(false)}
        />
        <IonButton expand="block" onClick={() => setShow(true)}>
          Show ActionSheet
        </IonButton>
        <IonButton
          expand="block"
          onClick={() => {
            setShow(true);
            setTimeout(() => setShow(false), 250);
          }}
        >
          Show ActionSheet, hide after 250 mss
        </IonButton>
        <div>{message}</div>
      </IonContent>
    </IonPage>
  );
};

export default ActionSheetComponent;
