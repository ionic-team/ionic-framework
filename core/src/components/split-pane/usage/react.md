```tsx
import React from 'react';
import {
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonRouterOutlet,
  IonContent,
  IonPage
} from '@ionic/react';

export const SplitPlaneExample: React.SFC<{}> = () => (
  <IonContent>
    <IonSplitPane contentId="menuContent">
      {/*--  our side menu  --*/}
      <IonMenu contentId="menuContent">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonMenu>

      {/*-- the main content --*/}
      <IonPage id="menuContent"/>
    </IonSplitPane>
  </IonContent>
);
```
