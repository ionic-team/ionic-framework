import React, { useRef, useEffect, useState } from 'react';
import {
  IonRouterOutlet,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';
import { Route } from 'react-router';

interface OutletRefProps {}

export const OutletRef: React.FC<OutletRefProps> = () => {
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
      </IonContent>
    </IonPage>
  );
};
