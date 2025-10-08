import React, { useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

const ModalTeleport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div id="example" style={{ minHeight: '40vh' }}></div>

        <IonButton id="teleport-background-action" onClick={() => setCount((c) => c + 1)}>
          Background Action
        </IonButton>
        <div>
          Background action count: <span id="teleport-background-action-count">{count}</span>
        </div>

        <IonButton id="open-teleport-modal" onClick={() => setIsOpen(true)}>
          Open Teleported Modal
        </IonButton>

        {isOpen && (
          <IonModal
            isOpen={true}
            onDidDismiss={() => setIsOpen(false)}
            onWillPresent={(event) => {
              const container = document.getElementById('example');
              if (container) {
                container.appendChild(event.target as HTMLElement);
              }
            }}
            breakpoints={[0.2, 0.5, 0.7]}
            initialBreakpoint={0.5}
            showBackdrop={false}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>Modal</IonTitle>
                <IonButtons slot="end">
                  <IonButton id="close-teleport-modal" onClick={() => setIsOpen(false)}>
                    Close
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni illum quidem recusandae ducimus quos
                reprehenderit. Veniam, molestias quos, dolorum consequuntur nisi deserunt omnis id illo sit cum qui.
                Eaque, dicta.
              </p>
            </IonContent>
          </IonModal>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ModalTeleport;
