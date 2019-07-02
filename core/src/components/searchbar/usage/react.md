```tsx
import React from 'react';
import { IonSearchbar, IonToolbar, IonContent } from '@ionic/react';

export const SearchbarExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default Searchbar --*/}
    <IonSearchbar></IonSearchbar>
    
    {/*-- Searchbar with cancel button always shown --*/}
    <IonSearchbar showCancelButton="always"></IonSearchbar>
    
    {/*-- Searchbar with cancel button never shown --*/}
    <IonSearchbar showCancelButton="never"></IonSearchbar>
    
    {/*-- Searchbar with cancel button shown on focus --*/}
    <IonSearchbar showCancelButton="focus"></IonSearchbar>

    {/*-- Searchbar with danger color --*/}
    <IonSearchbar color="danger"></IonSearchbar>

    {/*-- Searchbar with value --*/}
    <IonSearchbar value="Ionic"></IonSearchbar>

    {/*-- Searchbar with telephone type --*/}
    <IonSearchbar type="tel"></IonSearchbar>

    {/*-- Searchbar disabled  --*/}
    <IonSearchbar disabled={true}></IonSearchbar>

    {/*-- Searchbar with a cancel button and custom cancel button text --*/}
    <IonSearchbar showCancelButton="focus" cancelButtonText="Custom Cancel"></IonSearchbar>

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
  </IonContent>
);
```
