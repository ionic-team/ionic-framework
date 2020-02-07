```tsx
import React from 'react';
import { IonDrawer, IonContent } from '@ionic/react';

// Optional parameters to pass to the drawer instance. See https://github.com/roman-rr/cupertino-pane/ for valid options.
const drawerOpts = {
  showDraggable: true,
  breaks: {
    top: { enabled: false, offset: 0 },
    middle: { enabled: true, offset: 0 },
    bottom: { enabled: true, offset: 0 },
  }
};

export const DrawerExample: React.FC = () => (
  <IonContent>
    <ion-drawer options={drawerOpts} presentDefault={true}>
      <h1>Header</h1>
      <div>Content</div> 
    </ion-drawer>
  </IonContent>
);
```