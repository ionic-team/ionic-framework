```tsx
/* Using with useIonLoading Hook */

import React from 'react';
import { IonButton, IonContent, IonPage, useIonLoading } from '@ionic/react';

interface LoadingProps {}

const LoadingExample: React.FC<LoadingProps> = () => {
  const [present, dismiss] = useIonLoading();
  /**
   * The recommended way of dismissing is to use the `dismiss` property
   * on `IonLoading`, but the `dismiss` method returned from `useIonLoading`
   * can be used for more complex scenarios.
   */
  return (
    <IonPage>
      <IonContent>
        <IonButton
          expand="block"
          onClick={() => {
            present({
              message: 'Loading...',
              duration: 3000
            })
          }}
        >
          Show Loading
        </IonButton>
        <IonButton
          expand="block"
          onClick={() => present('Loading', 2000, 'dots')}
        >
          Show Loading using params
        </IonButton>
      </IonContent>
    </IonPage>
  );
};
```

```tsx
/* Using with IonLoading Component */

import React, { useState } from 'react';
import { IonLoading, IonButton, IonContent } from '@ionic/react';

export const LoadingExample: React.FC = () => {
  const [showLoading, setShowLoading] = useState(true);

  setTimeout(() => {
    setShowLoading(false);
  }, 2000);

  return (
    <IonContent>
      <IonButton onClick={() => setShowLoading(true)}>Show Loading</IonButton>
      <IonLoading
        cssClass='my-custom-class'
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Please wait...'}
        duration={5000}
      />
    </IonContent>
  );
};
```
