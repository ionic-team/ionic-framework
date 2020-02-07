```tsx
import React from 'react';

import { IonIcon } from '@ionic/react';

const Example: React.FC<{}> = () => (
  <>
    {/*-- uses "star" icon for both modes --*/}
    <IonIcon name="star"/>

    {/*-- explicitly set the icon for each mode --*/}
    <IonIcon ios="home" md="star"/>

    {/*-- use a custom svg icon --*/}
    <IonIcon src="/path/to/external/file.svg"/>

    {/*-- set the icon size --*/}
    <IonIcon size="small" name="heart"/>
    <IonIcon size="large" name="heart"/>
  </>
);

export default Example;
```
