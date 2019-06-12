```tsx
import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/react';

export const TabsExample: React.FunctionComponent = () => (
  <IonTabs>
    <IonTabBar slot="bottom">
      <IonTabButton tab="schedule">
        <IonIcon name="calendar" />
        <IonLabel>Schedule</IonLabel>
        <IonBadge>6</IonBadge>
      </IonTabButton>

      <IonTabButton tab="speakers">
        <IonIcon name="contacts" />
        <IonLabel>Speakers</IonLabel>
      </IonTabButton>

      <IonTabButton tab="map">
        <IonIcon name="map" />
        <IonLabel>Map</IonLabel>
      </IonTabButton>

      <IonTabButton tab="about">
        <IonIcon name="information-circle" />
        <IonLabel>About</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);
```
