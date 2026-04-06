import {
  IonRouterOutlet,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';
import React, { useRef, useEffect, useState } from 'react';
import { Route } from 'react-router';

import TestDescription from '../../components/TestDescription';

export const OutletRef: React.FC = () => {
  const ref = useRef<HTMLIonRouterOutletElement>(null);
  const [outletId, setOutletId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Update the outlet id once the ref is populated
    if (ref.current?.id) {
      setOutletId(ref.current.id);
    }
  }, []);

  return (
    <IonRouterOutlet id="main-outlet" ref={ref}>
      <Route
        path="/outlet-ref"
        element={<Main outletId={outletId} />}
      />
    </IonRouterOutlet>
  );
};

const Main: React.FC<{ outletId?: string }> = ({ outletId }) => {
  return (
    <IonPage data-pageid="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Main</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>{outletId}</div>
        <TestDescription>Verify the text "main-outlet" appears below. This confirms the ref on IonRouterOutlet resolves to the DOM element and its id is accessible. If the text is missing or blank, the ref is not working.</TestDescription>
      </IonContent>
    </IonPage>
  );
};
