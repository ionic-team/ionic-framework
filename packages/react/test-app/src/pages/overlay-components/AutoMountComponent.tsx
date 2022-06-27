import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonPage,
  IonModal,
  IonPopover,
} from '@ionic/react';

const AutoMountComponent: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonButton id="open-modal" onClick={() => setShowModal(true)}>Open Modal</IonButton>
        <IonButton id="open-popover" onClick={() => setShowPopover(true)}>Open Popover</IonButton>

        <IonModal id="default-modal" isOpen={showModal} onDidDismiss={() => setShowPopover(false)}>
          <IonContent>
            <IonButton onClick={() => setShowModal(false)}>Dismiss</IonButton>
            Modal Content
          </IonContent>
        </IonModal>

        <IonPopover isOpen={showPopover} onDidDismiss={() => setShowPopover(false)}>
          <IonContent>
            <IonButton onClick={() => setShowPopover(false)}>Dismiss</IonButton>
            Popover Content
          </IonContent>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default AutoMountComponent;
