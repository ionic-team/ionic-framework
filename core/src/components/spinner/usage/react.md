```tsx
import React from 'react';

import { IonSpinner } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default Spinner --*/}
    <IonSpinner></IonSpinner>

    {/*-- Lines --*/}
    <IonSpinner name="lines"></IonSpinner>

    {/*-- Lines Small --*/}
    <IonSpinner name="lines-small"></IonSpinner>

    {/*-- Dots --*/}
    <IonSpinner name="dots"></IonSpinner>

    {/*-- Bubbles --*/}
    <IonSpinner name="bubbles"></IonSpinner>

    {/*-- Circles --*/}
    <IonSpinner name="circles"></IonSpinner>

    {/*-- Crescent --*/}
    <IonSpinner name="crescent"></IonSpinner>

    {/*-- Paused Default Spinner --*/}
    <IonSpinner paused></IonSpinner>
  </>
);

export default Example;
```
