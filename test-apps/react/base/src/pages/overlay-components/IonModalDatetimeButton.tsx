import { IonButton, IonContent, IonDatetime, IonDatetimeButton, IonModal } from '@ionic/react';
import { useRef } from 'react';
import { useState } from 'react';

const IonModalDatetimeButton = () => {
  const [showIonModal, setShowIonModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const modal = useRef<HTMLIonModalElement>(null);

  return (
    <IonContent>
      <IonButton
        id="renderModalBtn"
        onClick={() => {
          setShowIonModal(true);
          setIsOpen(true);
        }}
      >
        Render Modal
      </IonButton>
      {showIonModal && (
        <IonModal
          ref={modal}
          isOpen={isOpen}
          onDidDismiss={() => {
            setIsOpen(false);
            setShowIonModal(false);
          }}
        >
          <IonContent>
            Modal Content
            <IonDatetimeButton datetime="startDate" />
            <IonModal id="datetimeModal" keepContentsMounted={true}>
              <IonDatetime
                id="startDate"
                preferWheel
                presentation="date"
                name="startDate"
                showDefaultButtons
                color="primary"
              />
            </IonModal>
          </IonContent>
        </IonModal>
      )}
    </IonContent>
  );
};

export default IonModalDatetimeButton;
