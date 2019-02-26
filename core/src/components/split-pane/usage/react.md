```tsx
import React from 'react';

import { IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonRouterOutlet } from '@ionic/react';

const Example: React.SFC<{}> = () => (

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
    <IonRouterOutlet></IonRouterOutlet>
  </IonSplitPane>
);

export default Example;
```
