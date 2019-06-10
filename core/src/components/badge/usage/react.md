```tsx
import React from 'react';

import { IonBadge, IonItem, IonLabel } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default --*/}
    <IonBadge>99</IonBadge>

    {/*-- Colors --*/}
    <IonBadge color="primary">11</IonBadge>
    <IonBadge color="secondary">22</IonBadge>
    <IonBadge color="tertiary">33</IonBadge>
    <IonBadge color="success">44</IonBadge>
    <IonBadge color="warning">55</IonBadge>
    <IonBadge color="danger">66</IonBadge>
    <IonBadge color="light">77</IonBadge>
    <IonBadge color="medium">88</IonBadge>
    <IonBadge color="dark">99</IonBadge>

    {/*-- Item with badge on left and right --*/}
    <IonItem>
      <IonBadge slot="start">11</IonBadge>
      <IonLabel>My Item</IonLabel>
      <IonBadge slot="end">22</IonBadge>
    </IonItem>
  </>
);

export default Example;
```
