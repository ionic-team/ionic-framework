```tsx
import React from 'react';

import { IonToggle, IonList, IonItem, IonLabel } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default Toggle --*/}
    <IonToggle></IonToggle>

    {/*-- Disabled Toggle --*/}
    <IonToggle disabled></IonToggle>

    {/*-- Checked Toggle --*/}
    <IonToggle checked></IonToggle>

    {/*-- Toggle Colors --*/}
    <IonToggle color="primary"></IonToggle>
    <IonToggle color="secondary"></IonToggle>
    <IonToggle color="danger"></IonToggle>
    <IonToggle color="light"></IonToggle>
    <IonToggle color="dark"></IonToggle>

    {/*-- Toggles in a List --*/}
    <IonList>
      <IonItem>
        <IonLabel>Pepperoni</IonLabel>
        <IonToggle value="pepperoni" onChange={() => {}}></IonToggle>
      </IonItem>

      <IonItem>
        <IonLabel>Sausage</IonLabel>
        <IonToggle value="sausage" onChange={() => {}} disabled={true}></IonToggle>
      </IonItem>

      <IonItem>
        <IonLabel>Mushrooms</IonLabel>
        <IonToggle value="mushrooms" onChange={() => {}}></IonToggle>
      </IonItem>
    </IonList>
  </>
);

export default Example;
```
