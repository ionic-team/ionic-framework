```tsx
import React from 'react';
import { IonList, IonItem, IonRange, IonLabel, IonIcon, IonContent } from '@ionic/react';

export const RangeExample: React.FunctionComponent = () => (
  <IonContent>
    <IonList>
      <IonItem>
        <IonRange color="danger" pin={true} />
      </IonItem>

      <IonItem>
        <IonRange min={-200} max={200} color="secondary">
          <IonLabel slot="start">-200</IonLabel>
          <IonLabel slot="end">200</IonLabel>
        </IonRange>
      </IonItem>

      <IonItem>
        <IonRange min={20} max={80} step={2}>
          <IonIcon size="small" slot="start" name="sunny" />
          <IonIcon slot="end" name="sunny" />
        </IonRange>
      </IonItem>

      <IonItem>
        <IonRange min={1000} max={2000} step={100} snaps={true} color="secondary" />
      </IonItem>

      <IonItem>
        <IonRange min={1000} max={2000} step={100} snaps={true} ticks={false} color="secondary" />
      </IonItem>

      <IonItem>
        <IonRange dualKnobs={true} min={21} max={72} step={3} snaps={true} />
      </IonItem>
    </IonList>
  </IonContent>
);
```
