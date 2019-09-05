```tsx
import React from 'react';
import {
  IonToolbar,
  IonTitle
} from '@ionic/react';

export const ToolbarExample: React.FC = () => (
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>

  <IonToolbar>
    <IonTitle size="small">Small Title above a Default Title</IonTitle>
  </IonToolbar>
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>
);
```
