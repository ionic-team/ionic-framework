import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonRouterOutlet,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { Route } from 'react-router';

const PropsTest: React.FC = () => {
  const [count, setCount] = useState(1);
  useEffect(() => {
    console.log(count);
  }, [count]);
  return (
    <IonRouterOutlet>
      <Route
        path="/routing/propstest"
        element={<InnerPropsTest count={count} setCount={setCount} />}
      />
    </IonRouterOutlet>
  );
};

const InnerPropsTest: React.FC<{ count: number; setCount: any }> = ({ count, setCount }) => {
  return (
    <IonPage data-pageid="props-test">
      <IonHeader>
        <IonToolbar>
          <IonTitle>PropsTest</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="count-label">Count: {count}</div>
        <IonButton onClick={() => setCount(count + 1)}>Increment</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PropsTest;
