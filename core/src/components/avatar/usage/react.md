```tsx
import React from 'react'
import { IonAvatar, IonChip, IonItem, IonLabel, IonContent } from '@ionic/react';

export const AvatarExample: React.FunctionComponent = () => (
  <IonContent>
    <IonAvatar>
      <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
    </IonAvatar>

    <IonChip>
      <IonAvatar>
        <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
      </IonAvatar>
      <IonLabel>Chip Avatar</IonLabel>
    </IonChip>

    <IonItem>
      <IonAvatar slot="start">
        <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
      </IonAvatar>
      <IonLabel>Item Avatar</IonLabel>
    </IonItem>
  </IonContent>
);
```