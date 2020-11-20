```tsx
import React, { useState } from 'react';
import { IonModal, IonButton, IonContent } from '@ionic/react';

export const ModalExample: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <IonContent>
      <IonModal isOpen={showModal} cssClass='my-custom-class'>
        <p>This is modal content</p>
        <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>Show Modal</IonButton>
    </IonContent>
  );
};
```

> If you need a wrapper element inside of your modal component, we recommend using an `<IonPage>` so that the component dimensions are still computed properly.

### Swipeable Modals

Modals in iOS mode have the ability to be presented in a card-style and swiped to close. The card-style presentation and swipe to close gesture are not mutually exclusive, meaning you can pick and choose which features you want to use. For example, you can have a card-style modal that cannot be swiped or a full sized modal that can be swiped.

> Card style modals when running on iPhone-sized devices do not have backdrops. As a result, the `--backdrop-opacity` variable will not have any effect.

```tsx
const App: React.FC = () => {
  const routerRef = useRef<HTMLIonRouterOutletElement | null>(null);
  
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet ref={routerRef}>
          <Route path="/home" render={() => <Home router={routerRef.current} />}  exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

...

interface HomePageProps {
  router: HTMLIonRouterOutletElement | null;
}

const Home: React.FC<HomePageProps> = ({ router }) => {
  const [showModal, setShowModal] = useState(false);
  
  return (
    ...
    
    <IonModal
      isOpen={showModal}
      cssClass='my-custom-class'
      swipeToClose={true}
      presentingElement={router || undefined}
      onDidDismiss={() => setShowModal(false)}>
      <p>This is modal content</p>
    </IonModal>
    
    ...
  );
};

```

In most scenarios, setting a ref on `IonRouterOutlet` and passing that ref's `current` value to `presentingElement` is fine. In cases where you are presenting a card-style modal from within another modal, you should pass in the top-most `ion-modal` ref as the `presentingElement`.

```tsx
<IonModal
  ref={firstModalRef}
  isOpen={showModal}
  cssClass='my-custom-class'
  swipeToClose={true}
  presentingElement={router || undefined}
  onDidDismiss={() => setShowModal(false)}>
    <p>This is modal content</p>
    <IonButton onClick={() => setShow2ndModal(true)}>Show 2nd Modal</IonButton>
    <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
</IonModal>
<IonModal
  isOpen={show2ndModal}
  cssClass='my-custom-class'
  presentingElement={firstModalRef.current}
  onDidDismiss={() => setShow2ndModal(false)}>
  <p>This is more modal content</p>
  <IonButton onClick={() => setShow2ndModal(false)}>Close Modal</IonButton>
</IonModal>
```
