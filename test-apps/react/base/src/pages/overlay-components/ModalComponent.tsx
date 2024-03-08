import React, { useCallback, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonPage,
  IonModal,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useContext } from 'react';

const Body: React.FC<{
  count: number;
  onDismiss: () => void;
  onIncrement: () => void;
}> = ({ count, onDismiss, onIncrement }) => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>My Modal</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      Count in modal: {count}
      <IonButton expand="block" onClick={() => onIncrement()}>
        Increment Count
      </IonButton>
      <IonButton expand="block" onClick={() => onDismiss()}>
        Close
      </IonButton>
    </IonContent>
  </IonPage>
);

const ModalWithContext: React.FC = () => {
  const ctx = useContext(MyContext);
  return <div>{ctx.value}</div>;
};

const ModalComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const [showContext, setShowContext] = useState(false);

  const handleIncrement = useCallback(() => {
    setCount(count + 1);
  }, [count, setCount]);

  return (
    <MyContext.Provider value={{ value: 'overriden value' }}>
      <IonPage>
        <IonContent fullscreen>
          <IonModal isOpen={show} className="my-class" onDidDismiss={() => setShow(false)}>
            <Body
              count={count}
              onDismiss={() => setShow(false)}
              onIncrement={handleIncrement}
            />
          </IonModal>
          <IonModal isOpen={showContext} onDidDismiss={() => setShowContext(false)}>
            <ModalWithContext />
          </IonModal>

          <IonButton
            expand="block"
            onClick={() => {
              setShow(true);
            }}
          >
            Show Modal
          </IonButton>
          <IonButton
            expand="block"
            onClick={() => {
              setShow(true);
              setTimeout(() => setShow(false), 250);
            }}
          >
            Show Modal, hide after 250 ms
          </IonButton>
          <IonButton
            expand="block"
            onClick={() => {
              setShowContext(true);
            }}
          >
            Show Modal with Context
          </IonButton>

          <div>Count: {count}</div>
        </IonContent>
      </IonPage>
    </MyContext.Provider>
  );
};

const MyContext = React.createContext({
  value: 'default value',
});

export default ModalComponent;
