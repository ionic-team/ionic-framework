import React, { useState } from 'react';
import { IonButton, IonContent, IonModal, IonPage } from '@ionic/react';

const ModalFocusTrap: React.FC = () => {
  const [showNonTrapped, setShowNonTrapped] = useState(false);
  const [showTrapped, setShowTrapped] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonButton id="open-non-trapped-modal" onClick={() => setShowNonTrapped(true)}>
          Open Non-Trapped Sheet Modal
        </IonButton>
        <IonButton id="open-trapped-modal" color="primary" onClick={() => setShowTrapped(true)}>
          Open Focus-Trapped Sheet Modal
        </IonButton>

        <IonButton id="background-action" onClick={() => setCount((c) => c + 1)}>
          Background Action
        </IonButton>
        <div>
          Background action count: <span id="background-action-count">{count}</span>
        </div>

        <IonModal
          isOpen={showNonTrapped}
          onDidDismiss={() => setShowNonTrapped(false)}
          breakpoints={[0, 0.25, 0.5, 0.75, 1]}
          initialBreakpoint={0.25}
          backdropDismiss={false}
          focusTrap={false}
          handleBehavior="cycle"
        >
          <IonContent className="ion-padding">
            <p>Non-trapped modal content</p>
            <IonButton onClick={() => setShowNonTrapped(false)}>Close</IonButton>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={showTrapped}
          onDidDismiss={() => setShowTrapped(false)}
          breakpoints={[0, 0.25, 0.5, 0.75, 1]}
          initialBreakpoint={0.5}
          backdropDismiss={false}
          focusTrap={true}
          handleBehavior="cycle"
        >
          <IonContent className="ion-padding">
            <p>Focus-trapped modal content</p>
            <IonButton onClick={() => setShowTrapped(false)}>Close</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ModalFocusTrap;

