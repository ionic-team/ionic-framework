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
import React, { useState } from 'react';
import { Navigate, Route, useNavigate } from 'react-router-dom';

/**
 * Tests that aria-hidden is cleaned up on the root router outlet
 * when a modal is removed from the DOM without being dismissed
 * (e.g., navigating to a different nested outlet while the modal is open).
 *
 * Structure:
 * - Parent IonRouterOutlet (id="modal-aria-hidden-root")
 *   - SectionA (nested IonRouterOutlet with ionPage)
 *     - PageA: has a modal with a button that navigates to SectionB
 *   - SectionB (nested IonRouterOutlet with ionPage)
 *     - PageB: simple page
 */

const PageA: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <IonPage data-pageid="modal-page-a">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Page A</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="openModal" onClick={() => setIsOpen(true)}>
          Open Modal
        </IonButton>
        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
          <IonContent>
            <IonButton
              id="navigateToB"
              onClick={() => {
                // Navigate without dismissing the modal first.
                // The modal will be auto-removed when React unmounts it,
                // but aria-hidden on the root outlet should be cleaned up.
                navigate('/modal-aria-hidden/section-b');
              }}
            >
              Navigate to Section B
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

const PageB: React.FC = () => (
  <IonPage data-pageid="modal-page-b">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Page B</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <p id="page-b-content">Page B Content</p>
    </IonContent>
  </IonPage>
);

const SectionA: React.FC = () => (
  <IonRouterOutlet ionPage id="section-a">
    <Route path="/modal-aria-hidden/section-a" element={<PageA />} />
  </IonRouterOutlet>
);

const SectionB: React.FC = () => (
  <IonRouterOutlet ionPage id="section-b">
    <Route path="/modal-aria-hidden/section-b" element={<PageB />} />
  </IonRouterOutlet>
);

const ModalAriaHidden: React.FC = () => (
  <IonRouterOutlet id="modal-aria-hidden-root">
    <Route path="/modal-aria-hidden/section-a/*" element={<SectionA />} />
    <Route path="/modal-aria-hidden/section-b/*" element={<SectionB />} />
    <Route
      path="/modal-aria-hidden"
      element={<Navigate to="/modal-aria-hidden/section-a" replace />}
    />
  </IonRouterOutlet>
);

export default ModalAriaHidden;
