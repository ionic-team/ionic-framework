```tsx
import React from 'react';

import { IonSearchbar, IonToolbar } from '@ionic/react';

const Example: React.SFC<{}> = () => (
  <>
    {/*-- Default Searchbar --*/}
    <IonSearchbar></IonSearchbar>

    {/*-- Searchbar with danger color --*/}
    <IonSearchbar color="danger"></IonSearchbar>

    {/*-- Searchbar with value --*/}
    <IonSearchbar value="Ionic"></IonSearchbar>

    {/*-- Searchbar with telephone type --*/}
    <IonSearchbar type="tel"></IonSearchbar>

    {/*-- Searchbar with a cancel button and custom cancel button text --*/}
    <IonSearchbar showCancelButton cancelButtonText="Custom Cancel"></IonSearchbar>

    {/*-- Searchbar with a custom debounce --*/}
    <IonSearchbar debounce={500}></IonSearchbar>

    {/*-- Animated Searchbar --*/}
    <IonSearchbar animated></IonSearchbar>

    {/*-- Searchbar with a placeholder --*/}
    <IonSearchbar placeholder="Filter Schedules"></IonSearchbar>

    {/*-- Searchbar in a Toolbar --*/}
    <IonToolbar>
      <IonSearchbar></IonSearchbar>
    </IonToolbar>
  </>
);

export default Example;
```
