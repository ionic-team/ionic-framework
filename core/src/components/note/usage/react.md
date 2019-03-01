```tsx
import React from 'react';

import { IonNote, IonList, IonItem, IonLabel } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default Note --*/}
    <IonNote>Default Note</IonNote>

    {/*-- Note Colors --*/}
    <IonNote color="primary">Primary Note</IonNote>
    <IonNote color="secondary">Secondary Note</IonNote>
    <IonNote color="danger">Danger Note</IonNote>
    <IonNote color="light">Light Note</IonNote>
    <IonNote color="dark">Dark Note</IonNote>

    {/*-- Notes in a List --*/}
    <IonList>
      <IonItem>
        <IonLabel>Note (End)</IonLabel>
        <IonNote slot="end">On</IonNote>
      </IonItem>

      <IonItem>
        <IonNote slot="start">Off</IonNote>
        <IonLabel>Note (Start)</IonLabel>
      </IonItem>
    </IonList>
  </>
);

export default Example
