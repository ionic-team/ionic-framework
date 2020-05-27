```tsx
import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonContent } from '@ionic/react';
import { call, person, settings } from 'ionicons/icons';

export const TabBarExample: React.FC = () => (
  <IonContent>
    <IonTabs>
      {/*-- Tab bar --*/}
      <IonTabBar slot="bottom">
        <IonTabButton tab="account">
          <IonIcon icon={person} />
        </IonTabButton>
        <IonTabButton tab="contact">
          <IonIcon icon={call} />
        </IonTabButton>
        <IonTabButton tab="settings">
          <IonIcon icon={settings} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonContent>
);
```
