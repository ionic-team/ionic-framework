import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Route } from 'react-router';

/**
 * Parent component with counter buttons and nested router outlet.
 * This reproduces the issue from https://github.com/ionic-team/ionic-framework/issues/30700
 * where sheet modals in child routes with showBackdrop=false block interaction with parent content.
 */
const ModalSheetChildRouteParent: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Parent Page with Nested Route</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <IonButton id="decrement-btn" onClick={() => setCount((c) => c - 1)}>
            -
          </IonButton>
          <p id="background-action-count">{count}</p>
          <IonButton id="increment-btn" onClick={() => setCount((c) => c + 1)}>
            +
          </IonButton>
        </div>
      </IonContent>
      <IonRouterOutlet>
        <Route path="/overlay-components/modal-sheet-child-route/child" component={ModalSheetChildRouteChild} />
      </IonRouterOutlet>
    </IonPage>
  );
};

const ModalSheetChildRouteChild: React.FC = () => {
  return (
    <IonPage>
      <IonModal
        isOpen={true}
        breakpoints={[0.2, 0.5, 0.7]}
        initialBreakpoint={0.5}
        showBackdrop={false}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Modal in Child Route</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p id="modal-content-loaded">Modal content loaded in child route</p>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default ModalSheetChildRouteParent;
