```tsx
import React from 'react';
import { IonList, IonRadioGroup, IonListHeader, IonLabel, IonItem, IonRadio, IonContent } from '@ionic/react';

export const RadioExample: React.FC = () => (
  <IonContent>
    <IonList>
      <IonRadioGroup value="biff">
        <IonListHeader>
          <IonLabel>Name</IonLabel>
        </IonListHeader>

        <IonItem>
          <IonLabel>Biff</IonLabel>
          <IonRadio slot="start" value="biff" />
        </IonItem>

        <IonItem>
          <IonLabel>Griff</IonLabel>
          <IonRadio slot="start" value="griff" />
        </IonItem>

        <IonItem>
          <IonLabel>Buford</IonLabel>
          <IonRadio slot="start" value="buford" />
        </IonItem>
      </IonRadioGroup>
    </IonList>
  </IonContent>
);
```