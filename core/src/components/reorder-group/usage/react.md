```tsx
import React from 'react';

import { IonItem, IonLabel, IonReorder, IonReorderGroup, IonIcon } from '@ionic/react';

function doReorder(event: CustomEvent) {
  // The `from` and `to` properties contain the index of the item
  // when the drag started and ended, respectively
  console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

  // Finish the reorder and position the item in the DOM based on
  // where the gesture ended. This method can also be called directly
  // by the reorder group
  event.detail.complete();
}

const Example: React.SFC<{}> = () => (
  <>
    {/*-- The reorder gesture is disabled by default, enable it to drag and drop items --*/}
    <IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
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
    </IonReorderGroup>
  </>
  }
);

export default Example
