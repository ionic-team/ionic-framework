```tsx
import React from 'react';
import { IonItemDivider, IonLabel, IonList, IonItem, IonContent } from '@ionic/react';

export const ItemDividerExample: React.FunctionComponent = () => (
  <IonContent>
    <IonItemDivider>
      <IonLabel>
        Basic Item Divider
      </IonLabel>
    </IonItemDivider>

    <IonItemDivider color="secondary">
      <IonLabel>
        Secondary Item Divider
      </IonLabel>
    </IonItemDivider>

    {/*-- Item Dividers in a List --*/}
    <IonList>
      <IonItemDivider>
        <IonLabel>
          Section A
        </IonLabel>
      </IonItemDivider>

      <IonItem><IonLabel>A1</IonLabel></IonItem>
      <IonItem><IonLabel>A2</IonLabel></IonItem>
      <IonItem><IonLabel>A3</IonLabel></IonItem>
      <IonItem><IonLabel>A4</IonLabel></IonItem>
      <IonItem><IonLabel>A5</IonLabel></IonItem>

      <IonItemDivider>
        <IonLabel>
          Section B
        </IonLabel>
      </IonItemDivider>

      <IonItem><IonLabel>B1</IonLabel></IonItem>
      <IonItem><IonLabel>B2</IonLabel></IonItem>
      <IonItem><IonLabel>B3</IonLabel></IonItem>
      <IonItem><IonLabel>B4</IonLabel></IonItem>
      <IonItem><IonLabel>B5</IonLabel></IonItem>
    </IonList>
  </IonContent>
);
```