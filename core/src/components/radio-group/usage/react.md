```tsx
import React from 'react';

import { IonList, IonRadioGroup, IonListHeader, IonLabel, IonRadio, IonItem } from '@ionic/react';

const Example: React.SFC<{}> = () => (

  <IonList>
    <IonRadioGroup>
      <IonListHeader>
        Auto Manufacturers
      </IonListHeader>

      <IonItem>
        <IonLabel>Cord</IonLabel>
        <IonRadio value="cord"></IonRadio>
      </IonItem>

      <IonItem>
        <IonLabel>Duesenberg</IonLabel>
        <IonRadio value="duesenberg"></IonRadio>
      </IonItem>

      <IonItem>
        <IonLabel>Hudson</IonLabel>
        <IonRadio value="hudson"></IonRadio>
      </IonItem>

      <IonItem>
        <IonLabel>Packard</IonLabel>
        <IonRadio value="packard"></IonRadio>
      </IonItem>

      <IonItem>
        <IonLabel>Studebaker</IonLabel>
        <IonRadio value="studebaker"></IonRadio>
      </IonItem>
    </IonRadioGroup>
  </IonList>
);

export default Example
