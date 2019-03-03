```tsx
import React from 'react';

import { IonFab, IonFabButton, IonFabList } from '@ionic/react';

const Example: React.SFC<{}> = () => (

  <IonFab vertical="bottom" horizontal="end">
    <IonFabButton>Share</IonFabButton>

    <IonFabList side="top">
      <IonFabButton>Facebook</IonFabButton>
      <IonFabButton>Twitter</IonFabButton>
      <IonFabButton>Youtube</IonFabButton>
    </IonFabList>

    <IonFabList side="start">
      <IonFabButton>Vimeo</IonFabButton>
    </IonFabList>

  </IonFab>
);

export default Example
