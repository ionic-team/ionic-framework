```tsx
import React, { useState } from 'react';
import { IonModal, IonButton } from '@ionic/react';

const ModalExample: React.FunctionComponent = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <IonModal
        isOpen={showModal}
      >
        <p>This is modal content</p>
        <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
      </IonModal>
      <IonButton onClick={() => setShowModal(true)}>Show Modal</IonButton>
    </>
  );
};

export default ModalExample;
```
