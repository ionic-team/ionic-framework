import { IonButton, IonContent, IonHeader, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';
import React, { useLayoutEffect, useState } from 'react';
import { Route } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * Unmounting from a layout effect removes the outlet before it's ready.
 */
const TransientOutlet: React.FC<{ onMounted: () => void }> = ({ onMounted }) => {
  useLayoutEffect(onMounted, [onMounted]);

  return (
    <IonRouterOutlet ionPage>
      <Route path="*" element={<IonPage>Transient page</IonPage>} />
    </IonRouterOutlet>
  );
};

const OutletUnmountBeforeReady: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  return (
    <IonPage data-pageid="outlet-unmount-before-ready">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Outlet Unmount Before Ready</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <TestDescription>
          Tap the button a few times. Each tap mounts a nested outlet and removes it before it's ready, so the counter
          should go up without any errors in the console.
        </TestDescription>
        <IonButton
          id="mount-transient-outlet"
          onClick={() => {
            setAttempts((count) => count + 1);
            setMounted(true);
          }}
        >
          Mount and unmount outlet
        </IonButton>
        <p id="attempts">{attempts}</p>
        {mounted && <TransientOutlet onMounted={() => setMounted(false)} />}
      </IonContent>
    </IonPage>
  );
};

export default OutletUnmountBeforeReady;
