```tsx
import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonFooter } from '@ionic/react';

export const SearchBarExamples: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>IonSearchBar Examples</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Default Searchbar</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>

        <p>Searchbar with cancel button always shown</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="always"></IonSearchbar>

        <p>Searchbar with cancel button never shown</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="never"></IonSearchbar>

        <p>Searchbar with cancel button shown on focus</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus"></IonSearchbar>

        <p>Searchbar with danger color</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} color="danger"></IonSearchbar>

        <p>Searchbar with telephone type</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} type="tel"></IonSearchbar>

        <p>Searchbar with numeric inputmode</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} inputmode="numeric"></IonSearchbar>

        <p>Searchbar disabled </p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} disabled={true}></IonSearchbar>

        <p>Searchbar with a cancel button and custom cancel button text</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus" cancelButtonText="Custom Cancel"></IonSearchbar>

        <p>Searchbar with a custom debounce - Note: debounce only works on onIonChange event</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} debounce={1000}></IonSearchbar>

        <p>Animated Searchbar</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} animated></IonSearchbar>

        <p>Searchbar with a placeholder</p>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} placeholder="Filter Schedules"></IonSearchbar>

        <p>Searchbar in a Toolbar</p>
        <IonToolbar>
          <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
        </IonToolbar>

      </IonContent>
      <IonFooter>
        <IonToolbar>
          Search Text: {searchText ?? '(none)'}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};
```