```tsx
import React from 'react';

import { IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';

const Example: React.FunctionComponent<{}> = () => (
  <>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton goBack={() => {}} />
        </IonButtons>
        <IonTitle>My Navigation Bar</IonTitle>
      </IonToolbar>

      <IonToolbar>
        <IonTitle>Subheader</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent />
  </>
);

export default Example
