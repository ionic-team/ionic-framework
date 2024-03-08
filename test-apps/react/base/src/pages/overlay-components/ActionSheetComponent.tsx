import { IonButton, IonContent, IonPage, IonActionSheet } from '@ionic/react';
import React, { useState } from 'react';

const ActionSheetComponent: React.FC = () => {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [willPresentCount, setWillPresentCount] = useState(0);
  const [didDismissCount, setDidDismissCount] = useState(0);

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
          onWillPresent={() => {
            setWillPresentCount(willPresentCount + 1);
          }}
          onDidDismiss={() => {
            setDidDismissCount(didDismissCount + 1);
            setShow(false);
          }}
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
        <div>onWillPresent count: {willPresentCount}</div>
        <div>onDidDismiss count: {didDismissCount}</div>
      </IonContent>
    </IonPage>
  );
};

export default ActionSheetComponent;
