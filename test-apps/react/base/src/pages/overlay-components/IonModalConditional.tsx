import { IonButton, IonContent, IonModal } from '@ionic/react';
import { useRef } from 'react';
import { useState } from 'react';

/**
 * Issue: https://github.com/ionic-team/ionic-framework/issues/25590
 *
 * Exception is thrown when IonModal is conditionally rendered inline.
 */
const IonModalConditional = () => {
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
            <IonButton id="dismissModalBtn" onClick={() => modal.current!.dismiss()}>
              Close
            </IonButton>
          </IonContent>
        </IonModal>
      )}
    </IonContent>
  );
};

export default IonModalConditional;
