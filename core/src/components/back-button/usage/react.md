```tsx
import React from 'react';

import { IonBackButton, IonHeader, IonToolbar, IonButtons, IonMenuButton } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default back button --*/}
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton goBack={() => {}} />
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    {/*-- Back button with a default href --*/}
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton goBack={() => {}} defaultHref="home" />
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    {/*-- Back button with custom text and icon --*/}
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton
            goBack={() => {}}
            text="buttonText"
            icon="buttonIcon"
          />
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    {/*-- Back button with no text and custom icon --*/}
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton goBack={() => {}} text="" icon="add" />
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    {/*-- Danger back button next to a menu button --*/}
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
          <IonBackButton goBack={() => {}} color="danger" />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  </>
);

export default Example;
```