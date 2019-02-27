```tsx
import React from 'react';

import { IonContent, IonFooter, IonToolbar, IonTitle } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    <IonContent></IonContent>

    <IonFooter>
      <IonToolbar>
        <IonTitle>Footer</IonTitle>
      </IonToolbar>
    </IonFooter>
  </>
);

export default Example;
```
