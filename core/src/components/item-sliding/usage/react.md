```tsx
import React from 'react';

import { IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption } from '@ionic/react';

const Example: React.SFC<{}> = () => (

<IonList>
  <IonItemSliding>
    <IonItem>
      <IonLabel>Item</IonLabel>
    </IonItem>
    <IonItemOptions side="start">
      <IonItemOption onClick={() => {}}>Favorite</IonItemOption>
      <IonItemOption color="danger" onClick={() => {}}>Share</IonItemOption>
    </IonItemOptions>

    <IonItemOptions side="end">
      <IonItemOption onClick={() => {}}>Unread</IonItemOption>
    </IonItemOptions>
  </IonItemSliding>
</IonList>

);

export default Example;
```
