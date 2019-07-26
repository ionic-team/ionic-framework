```tsx
import React from 'react';
import { IonFab, IonFabButton, IonFabList, IonContent, IonIcon } from '@ionic/react';

export const FabListExample: React.FunctionComponent = () => (
  <IonContent>
    <IonFab vertical="bottom" horizontal="end">
      <IonFabButton>
        <IonIcon icon="share" />
      </IonFabButton>

      <IonFabList side="top">
        <IonFabButton color="primary">
          <IonIcon icon="logo-facebook" />
        </IonFabButton>
        <IonFabButton color="primary">
          <IonIcon icon="logo-twitter" />
        </IonFabButton>
        <IonFabButton color="primary">
          <IonIcon icon="logo-youtube" />
        </IonFabButton>
      </IonFabList>

      <IonFabList side="start">
        <IonFabButton color="primary">
          <IonIcon icon="logo-vimeo" />
        </IonFabButton>
      </IonFabList>
    </IonFab>
  </IonContent>
);

```