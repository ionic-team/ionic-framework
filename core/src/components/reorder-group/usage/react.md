```tsx
import React from 'react';

import { IonContent, IonList, IonItem, IonLabel, IonReorder, IonReorderGroup, IonIcon } from '@ionic/react';

const Example: React.SFC<{}> = () => (

  <IonContent>
    <IonList>
      <IonReorderGroup>

        <IonItem>
          <IonLabel>
            Item 1
          </IonLabel>
          <IonReorder slot="end"></IonReorder>
        </IonItem>

        <IonItem>
          <IonLabel>
            Item 2 (default ion-reorder slot="start")
          </IonLabel>
          <IonReorder slot="start"></IonReorder>
        </IonItem>

        <IonItem>
          <IonLabel>
            Item 3 (custom ion-reorder)
          </IonLabel>
          <IonReorder slot="end">
            <IonIcon name="pizza" />
          </IonReorder>
        </IonItem>

        <IonItem>
          <IonLabel>
            Item 4 (custom ion-reorder slot="start")
          </IonLabel>
          <IonReorder slot="start">
            <IonIcon name="pizza" />
          </IonReorder>
        </IonItem>

        <IonReorder>
          <IonItem>
            <IonLabel>
              Item 5 (the whole item can be dragged)
            </IonLabel>
            </IonItem>
        </IonReorder>

      </IonReorderGroup>
    </IonList>
  </IonContent>
);

export default Example
