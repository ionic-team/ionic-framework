```tsx
import React from 'react';

import { IonIcon, IonItem, IonLabel, IonReorder } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default reorder icon, end aligned items --*/}
    <IonItem>
      <IonLabel>
        Item 1
      </IonLabel>
      <IonReorder slot="end"></IonReorder>
    </IonItem>

    <IonItem>
      <IonLabel>
        Item 2
      </IonLabel>
      <IonReorder slot="end"></IonReorder>
    </IonItem>

    {/*-- Default reorder icon, start aligned items --*/}
    <IonItem>
      <IonReorder slot="start"></IonReorder>
      <IonLabel>
        Item 3
      </IonLabel>
    </IonItem>

    <IonItem>
      <IonReorder slot="start"></IonReorder>
      <IonLabel>
        Item 4
      </IonLabel>
    </IonItem>

    {/*-- Custom reorder icon end items --*/}
    <IonItem>
      <IonLabel>
        Item 5
      </IonLabel>
      <IonReorder slot="end">
        <IonIcon name="pizza"></IonIcon>
      </IonReorder>
    </IonItem>

    <IonItem>
      <IonLabel>
        Item 6
      </IonLabel>
      <IonReorder slot="end">
        <IonIcon name="pizza"></IonIcon>
      </IonReorder>
    </IonItem>

    {/*-- Items wrapped in a reorder, entire item can be dragged --*/}
    <IonReorder>
      <IonItem>
        <IonLabel>
          Item 7
        </IonLabel>
      </IonItem>
    </IonReorder>

    <IonReorder>
      <IonItem>
        <IonLabel>
          Item 8
        </IonLabel>
      </IonItem>
    </IonReorder>
  </>
);

export default Example;
```
