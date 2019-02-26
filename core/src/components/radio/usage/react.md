```tsx
import React from 'react';

import { IonList, IonRadioGroup, IonListHeader, IonLabel, IonItem, IonRadio } from '@ionic/react';

const Example: React.SFC<{}> = () => (

  <IonList>
    <IonRadioGroup>
      <IonListHeader>
        <IonLabel>Name</IonLabel>
      </IonListHeader>

      <IonItem>
        <IonLabel>Biff</IonLabel>
        <IonRadio slot="start" value="biff" checked></IonRadio>
      </IonItem>

      <IonItem>
        <IonLabel>Griff</IonLabel>
        <IonRadio slot="start" value="griff"></IonRadio>
      </IonItem>

      <IonItem>
        <IonLabel>Buford</IonLabel>
        <IonRadio slot="start" value="buford"></IonRadio>
      </IonItem>
    </IonRadioGroup>
  </IonList>
);

export default Example
