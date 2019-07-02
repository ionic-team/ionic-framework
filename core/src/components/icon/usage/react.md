```tsx
import React from 'react';

import { IonIcon } from '@ionic/react';

const Example: React.FunctionComponent<{}> = () => (
  <>
    {/*-- automatically uses the correct "star" icon depending on the mode --*/}
    <IonIcon name="star" />

    {/*-- explicitly set the icon for each mode --*/}
    <IonIcon ios="ios-home" md="md-home" />

    {/*-- always use the same icon, no matter what the mode is --*/}
    <IonIcon name="ios-clock" />
    <IonIcon name="logo-twitter" />

    {/*-- use a custom svg icon --*/}
    <IonIcon src="/path/to/external/file.svg" />

    {/*-- set the icon size --*/}
    <IonIcon size="small" name="heart" />
    <IonIcon size="large" name="heart" />
  </>
);

export default Example;
```
