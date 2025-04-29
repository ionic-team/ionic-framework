import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonModal,
  IonPopover,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
} from '@ionic/react';
import React, { useState } from 'react';

const KeepContentsMounted: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Keep Contents Mounted</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton id="open-modal" onClick={() => setShowModal(true)}>Open Modal</IonButton>
        <IonButton id="open-popover" onClick={() => setShowPopover(true)}>Open Popover</IonButton>

        <IonModal keepContentsMounted={true} id="default-modal" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent>
            <IonButton onClick={() => setShowModal(false)}>Dismiss</IonButton>
            Modal Content
          </IonContent>
        </IonModal>

        <IonPopover keepContentsMounted={true} isOpen={showPopover} onDidDismiss={() => setShowPopover(false)}>
          <IonContent>
            <IonButton onClick={() => setShowPopover(false)}>Dismiss</IonButton>
            Popover Content
          </IonContent>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default KeepContentsMounted;
