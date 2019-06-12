```tsx
import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonContent } from '@ionic/react';

export const TabBarExample: React.FunctionComponent = () => (
  <IonContent>
    <IonTabs>
      {/*-- Tab bar --*/}
      <IonTabBar slot="bottom">
        <IonTabButton tab="account">
          <IonIcon name="person" />
        </IonTabButton>
        <IonTabButton tab="contact">
          <IonIcon name="call" />
        </IonTabButton>
        <IonTabButton tab="settings">
          <IonIcon name="settings" />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonContent>
);
```
