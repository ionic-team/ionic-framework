```tsx
import React from 'react';
import { IonList, IonRadioGroup, IonListHeader, IonLabel, IonRadio, IonItem, IonContent } from '@ionic/react';

export const RadioGroupExample: React.FunctionComponent = () => (
  <IonContent>
    <IonList>
      <IonRadioGroup>
        <IonListHeader>Auto Manufacturers</IonListHeader>

        <IonItem>
          <IonLabel>Cord</IonLabel>
          <IonRadio value="cord" />
        </IonItem>

        <IonItem>
          <IonLabel>Duesenberg</IonLabel>
          <IonRadio value="duesenberg" />
        </IonItem>

        <IonItem>
          <IonLabel>Hudson</IonLabel>
          <IonRadio value="hudson" />
        </IonItem>

        <IonItem>
          <IonLabel>Packard</IonLabel>
          <IonRadio value="packard" />
        </IonItem>

        <IonItem>
          <IonLabel>Studebaker</IonLabel>
          <IonRadio value="studebaker" />
        </IonItem>
      </IonRadioGroup>
    </IonList>
  </IonContent>
);
```