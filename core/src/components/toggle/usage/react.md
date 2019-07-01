```tsx
import React from 'react';
import { IonToggle, IonList, IonItem, IonLabel, IonContent } from '@ionic/react';

export const ToggleExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default Toggle --*/}
    <IonToggle />

    {/*-- Disabled Toggle --*/}
    <IonToggle disabled />

    {/*-- Checked Toggle --*/}
    <IonToggle checked />

    {/*-- Toggle Colors --*/}
    <IonToggle color="primary" />
    <IonToggle color="secondary" />
    <IonToggle color="danger" />
    <IonToggle color="light" />
    <IonToggle color="dark" />

    {/*-- Toggles in a List --*/}
    <IonList>
      <IonItem>
        <IonLabel>Pepperoni</IonLabel>
        <IonToggle value="pepperoni" onChange={() => {}} />
      </IonItem>

      <IonItem>
        <IonLabel>Sausage</IonLabel>
        <IonToggle value="sausage" onChange={() => {}} disabled={true} />
      </IonItem>

      <IonItem>
        <IonLabel>Mushrooms</IonLabel>
        <IonToggle value="mushrooms" onChange={() => {}} />
      </IonItem>
    </IonList>
  </IonContent>
);
```