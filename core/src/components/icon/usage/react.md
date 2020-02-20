```tsx
import React from 'react';

import { IonIcon } from '@ionic/react';
import { star, home, heart };

const Example: React.FC<{}> = () => (
  <>
    {/*-- uses "star" icon for both modes --*/}
    <IonIcon icon={star} />

    {/*-- explicitly set the icon for each mode --*/}
    <IonIcon ios={home} md={star}/>

    {/*-- use a custom svg icon --*/}
    <IonIcon src="/path/to/external/file.svg"/>

    {/*-- set the icon size --*/}
    <IonIcon size="small" icon={heart} />
    <IonIcon size="large" icon={heart} />
  </>
);

export default Example;
```
