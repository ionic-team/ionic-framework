```tsx
import React from 'react';
import { IonList, IonItem, IonLabel, IonContent, IonListHeader } from '@ionic/react';

export const ListHeaderExample: React.FunctionComponent = () => (
  <IonContent>
    <IonList>
      <IonListHeader>
        <IonLabel>Items</IonLabel>
      </IonListHeader>
      <IonItem>Item 1</IonItem>
      <IonItem>Item 2</IonItem>
      <IonItem>Item 3</IonItem>
      <IonItem>Item 4</IonItem>
      <IonItem>Item 5</IonItem>
    </IonList>
  </IonContent>
);
```