```tsx
import React from 'react';

import { IonContent, IonRefresher, IonRefresherContent } from '@ionic/react';

function doRefresh(event: CustomEvent) {
  console.log('Begin async operation');

  setTimeout(() => {
    console.log('Async operation has ended');
    event.target.complete();
  }, 2000);
}

const Example: React.SFC<{}> = () => (
  <>
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
  </>
  }
);

export default Example
