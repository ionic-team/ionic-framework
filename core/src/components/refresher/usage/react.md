```tsx
import React from 'react';
import { IonContent, IonRefresher, IonRefresherContent } from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';

function doRefresh(event: CustomEvent<RefresherEventDetail>) {
  console.log('Begin async operation');

  setTimeout(() => {
    console.log('Async operation has ended');
    event.detail.complete();
  }, 2000);
}

export const RefresherExample: React.FC = () => (
  <IonContent>
    {/*-- Default Refresher --*/}
    <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
    </IonContent>

    {/*-- Custom Refresher Properties --*/}
    <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullFactor={0.5} pullMin={100} pullMax={200}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
    </IonContent>

    {/*-- Custom Refresher Content --*/}
    <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
        <IonRefresherContent
          pullingIcon="arrow-dropdown"
          pullingText="Pull to refresh"
          refreshingSpinner="circles"
          refreshingText="Refreshing...">
        </IonRefresherContent>
      </IonRefresher>
    </IonContent>
  </IonContent>
);

```

### Native Refreshers

Both iOS and Android modes provide refreshers that take advantage of properties exposed by their respective devices that give pull to refresh a fluid, native-like feel. One of the limitations of this is that the refreshers only work on their respective platform devices. For example, the iOS native `IonRefresher` works on an iPhone in iOS mode, but does not work on an Android device in iOS mode.

#### iOS Usage

```tsx
import React from 'react';
import { IonContent, IonHeader, IonList, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from '@ionic/react';

export const RefresherExample: React.FC = () => (
  <IonContent>
    <IonRefresher slot="fixed" contentId="my-content" onIonRefresh={doRefresh}>
      <IonRefresherContent></IonRefresherContent>
    </IonRefresher>
    
    <div id="my-content">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">All Inboxes</IonTitle>
        </IonToolbar>
        <IonToolbarr>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>
  
      <IonList>
      ...
      </IonList>
    </div>
  </IonContent>
);
```

Using the iOS native `IonRefresher` requires setting the `pullingIcon` property on `IonRefresherContent` to the value of one of the available spinners. See the [ion-spinner Documentation](https://ionicframework.com/docs/api/spinner#properties) for accepted values. `pullingIcon` defaults to the `lines` spinner on iOS. The spinner tick marks will be progressively shown as the user pulls down on the page. Additionally, a `contentId` value must be provided to `IonRefresher`. This corresponds to all elements inside `IonContent` except for `IonRefresher`. This allows for consistent theming while still taking full advantage of the native refresher.

#### Android Usage

Coming soon!