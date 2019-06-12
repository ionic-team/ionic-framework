```tsx
import React from 'react';
import { IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';

export const GridExample: React.FunctionComponent = () => (
  <IonContent>
    <IonGrid>
      <IonRow>
        <IonCol>ion-col</IonCol>
        <IonCol>ion-col</IonCol>
        <IonCol>ion-col</IonCol>
        <IonCol>ion-col</IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="6">ion-col size="6"</IonCol>
        <IonCol>ion-col</IonCol>
        <IonCol>ion-col</IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="3">ion-col size="3"</IonCol>
        <IonCol>ion-col</IonCol>
        <IonCol size="3">ion-col size="3"</IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="3">ion-col size="3"</IonCol>
        <IonCol size="3" offset="3">
          ion-col size="3" offset="3"
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>ion-col</IonCol>
        <IonCol>
          ion-col
          <br />#
        </IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol align-self-start>ion-col start</IonCol>
        <IonCol align-self-center>ion-col center</IonCol>
        <IonCol align-self-end>ion-col end</IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow align-items-start>
        <IonCol>start ion-col</IonCol>
        <IonCol>start ion-col</IonCol>
        <IonCol align-self-end>start ion-col end</IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow align-items-center>
        <IonCol>center ion-col</IonCol>
        <IonCol>center ion-col</IonCol>
        <IonCol>center ion-col</IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow align-items-end>
        <IonCol>end ion-col</IonCol>
        <IonCol align-self-start>end ion-col start</IonCol>
        <IonCol>end ion-col</IonCol>
        <IonCol>
          ion-col
          <br />#
          <br />#
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-sm>
          ion-col size="12" size-sm
        </IonCol>
        <IonCol size="12" size-sm>
          ion-col size="12" size-sm
        </IonCol>
        <IonCol size="12" size-sm>
          ion-col size="12" size-sm
        </IonCol>
        <IonCol size="12" size-sm>
          ion-col size="12" size-sm
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-md>
          ion-col size="12" size-md
        </IonCol>
        <IonCol size="12" size-md>
          ion-col size="12" size-md
        </IonCol>
        <IonCol size="12" size-md>
          ion-col size="12" size-md
        </IonCol>
        <IonCol size="12" size-md>
          ion-col size="12" size-md
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="6" size-lg offset="3">
          ion-col size="6" size-lg offset="3"
        </IonCol>
        <IonCol size="3" size-lg>
          ion-col size="3" size-lg
        </IonCol>
      </IonRow>
    </IonGrid>
  </IonContent>
);
```