import React from 'react';
import { IonButton, IonContent, IonPage, useIonActionSheet } from '@ionic/react';
import { useState } from 'react';

const ActionSheetHook: React.FC = () => {
  const [present, dismiss] = useIonActionSheet();
  const [message, setMessage] = useState('');

  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={() =>
            present({
              buttons: [
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
              ],
              header: 'Action Sheet',
            })
          }
        >
          Show ActionSheet with options
        </IonButton>
        <IonButton
          expand="block"
          onClick={() =>
            present(
              [
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
              ],
              'Action Sheet'
            )
          }
        >
          Show ActionSheet with params
        </IonButton>
        <IonButton
          expand="block"
          onClick={() => {
            present([{ text: 'Ok' }, { text: 'Cancel' }], 'Action Sheet');
            setTimeout(dismiss, 250);
          }}
        >
          Show ActionSheet, hide after 250 mss
        </IonButton>
        <div>{message}</div>
      </IonContent>
    </IonPage>
  );
};

export default ActionSheetHook;
