```tsx
import React from 'react';

import { IonBackdrop } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default backdrop --*/}
    <IonBackdrop />

    {/*-- Backdrop that is not tappable --*/}
    <IonBackdrop tappable={false} />

    {/*-- Backdrop that is not visible --*/}
    <IonBackdrop visible={false} />

    {/*-- Backdrop with propagation --*/}
    <IonBackdrop stopPropagation={false} />

    <IonBackdrop
      tappable={true}
      visible={true}
      stopPropagation={true}
    />
  </>
);

export default Example;
```
