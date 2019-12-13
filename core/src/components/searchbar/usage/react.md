```tsx
import React from 'react';
import { IonSearchbar, IonToolbar, IonContent } from '@ionic/react';

export const SearchbarExample: React.FC = () => (
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

    {/*-- Searchbar with numeric inputmode --*/}
    <IonSearchbar inputmode="numeric"></IonSearchbar>

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

### Showing the proper keyboard submit button

#### Android

By default, tapping `IonSearchbar` will cause the keyboard to appear with a magnifying glass icon on the submit button. You can optionally set `inputmode="search"`, which will change the icon from a magnifying glass to a carriage return.

#### iOS

By default, tapping `IonSearchbar` will cause the keyboard to appear with the text "return" on a gray submit button. You can optionally set `inputmode="search"`, which will change the text from "return" to "go", and change the button color from gray to blue. Additionally, you can wrap the `IonSearchbar` in a `form` element with an `action` property. This will cause the keyboard to appear with a blue submit button that says "search".