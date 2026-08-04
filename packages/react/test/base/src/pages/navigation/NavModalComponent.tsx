import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonNav,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';

const ModalPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nav Modal Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="open-modal" onClick={() => setIsOpen(true)}>
          Open Modal
        </IonButton>
        <div id="page-click-count">{clickCount}</div>
        <div id="page-input-value">{inputValue}</div>

        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
          <IonContent>
            <IonButton id="increment-button" onClick={() => setClickCount((c) => c + 1)}>
              Increment
            </IonButton>
            <input
              id="text-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <IonButton id="close-modal" onClick={() => setIsOpen(false)}>
              Close
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </>
  );
};

const NavModalComponent: React.FC = () => {
  return (
    <IonPage>
      <IonNav root={() => <ModalPage />} />
    </IonPage>
  );
};

export default NavModalComponent;
