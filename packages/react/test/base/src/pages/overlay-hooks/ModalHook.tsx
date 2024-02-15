import React, { useCallback, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonPage,
  useIonModal,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useContext } from 'react';

const Body: React.FC<{
  type?: string;
  count?: number;
  onDismiss: (data?: any, role?: string) => void;
  onIncrement?: () => void;
}> = ({ count, onDismiss, onIncrement, type }) => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>My {type} Modal</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      Count in modal: {count}
      <IonButton expand="block" onClick={() => onIncrement?.()}>
        Increment Count
      </IonButton>
      <IonButton expand="block" onClick={() => onDismiss({ test: true }, 'close')}>
        Close
      </IonButton>

      <button onClick={onDismiss} id="show-secondary-modal">Show Secondary Modal</button>
    </IonContent>
  </IonPage>
);

const ModalWithContext: React.FC = () => {
  const ctx = useContext(MyContext);
  return <div>{ctx.value}</div>;
};

const ModalHook: React.FC = () => {
  const [count, setCount] = useState(0);

  const [dismissedRole, setDismissedRole] = useState<string | undefined>();
  const [dismissedData, setDismissedData] = useState();

  const handleIncrement = useCallback(() => {
    setCount(count + 1);
  }, [count, setCount]);

  const handleDismissWithComponent = useCallback((data?: any, role?: string) => {
    dismissWithComponent(data, role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismissWithElement = useCallback(() => {
    dismissWithElement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * First parameter to useIonModal is the component to show, second is props
   */
  const [presentWithComponent, dismissWithComponent] = useIonModal(Body, {
    count: count,
    onIncrement: handleIncrement,
    onDismiss: handleDismissWithComponent,
    type: 'Component',
  });

  /**
   * First parameter to useIonModal is the element to show
   */
  const [presentWithElement, dismissWithElement] = useIonModal(
    <Body
      count={count}
      onDismiss={handleDismissWithElement}
      onIncrement={handleIncrement}
      type="Element"
    />
  );

  const [presentModalWithContext] = useIonModal(ModalWithContext);

  const [presentSecondaryModal] = useIonModal(ModalSecondary);
  const [presentRootModal, dismissRootModal] = useIonModal(Body, {
    onDismiss: () => {
      dismissRootModal();
      presentSecondaryModal();
    }
  });

  return (
    <MyContext.Provider value={{ value: 'overriden value' }}>
      <IonPage>
        <IonContent fullscreen>
          <IonButton
            expand="block"
            onClick={() => {
              presentWithComponent({
                cssClass: 'my-class',
                onDidDismiss: (ev) => {
                  const { data, role } = ev.detail;
                  setDismissedData(data);
                  setDismissedRole(role);
                },
              });
            }}
          >
            Show Modal using component param
          </IonButton>
          <IonButton
            expand="block"
            onClick={() => {
              presentWithElement({
                cssClass: 'my-class',
              });
            }}
          >
            Show Modal using element param
          </IonButton>
          <IonButton
            expand="block"
            onClick={() => {
              presentWithElement({
                cssClass: 'my-class',
              });
              setTimeout(dismissWithElement, 250);
            }}
          >
            Show Modal, hide after 250 ms
          </IonButton>
          <IonButton
            expand="block"
            onClick={() => {
              presentModalWithContext({
                cssClass: 'my-class',
              });
            }}
          >
            Show Modal with Context
          </IonButton>

          <IonButton
            expand="block"
            onClick={() => {
              presentRootModal()
            }}
            id="show-root-modal"
          >
            Show Root Modal
          </IonButton>

          <div>Count: {count}</div>
          <div>Dismissed with role: {dismissedRole}</div>
          <div>Data: {dismissedData && JSON.stringify(dismissedData)}</div>
        </IonContent>
      </IonPage>
    </MyContext.Provider>
  );
};

const ModalSecondary: React.FC = () => {
  return (
    <div className="ion-padding">
      <h1>Secondary Modal</h1>
      <p>This text should be visible</p>
    </div>
  )
}

const MyContext = React.createContext({
  value: 'default value',
});

export default ModalHook;
