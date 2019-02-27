```tsx
import React from 'react';

import { IonThumbnail, IonItem, IonLabel } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    <IonThumbnail>
      <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
    </IonThumbnail>

    <IonItem>
      <IonThumbnail slot="start">
        <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
      </IonThumbnail>
      <IonLabel>Item Thumbnail</IonLabel>
    </IonItem>
  </>
);

export default Example;
```
