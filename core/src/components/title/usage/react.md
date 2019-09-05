```tsx
import React from 'react';
import {
  IonToolbar,
  IonTitle
} from '@ionic/react';

export const ToolbarExample: React.FC = () => (
  {/*-- Default title --*/}
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>
  
  {/*-- Large title --*/}
  <IonToolbar>
    <IonTitle size="large">Large Title</IonTitle>
  </IonToolbar>
);
```