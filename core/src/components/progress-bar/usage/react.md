```tsx
import React from 'react';

import { IonProgressBar } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default Progressbar --*/}
    <IonProgressBar></IonProgressBar>

    {/*-- Default Progressbar with 50 percent --*/}
    <IonProgressBar value={0.5}></IonProgressBar>

    {/*-- Colorize Progressbar --*/}
    <IonProgressBar color="primary" value={0.5}></IonProgressBar>
    <IonProgressBar color="secondary" value={0.5}></IonProgressBar>

    {/*-- Other types --*/}
    <IonProgressBar value={0.25} buffer={0.5}></IonProgressBar>
    <IonProgressBar type="indeterminate"></IonProgressBar>
    <IonProgressBar type="indeterminate" reversed={true}></IonProgressBar>
  </>
);

export default Example;
```
