```tsx
import React, { Component } from 'react';

import { IonButton, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonList } from '@ionic/react';

export default class Example extends Component<Props, State> {

  ionInfiniteScrollRef: React.RefObject<HTMLionInfiniteScrollElement>

  constructor() {
    this.ionInfiniteScrollRef = React.createRef<HTMLionInfiniteScrollElement>();
  }

  loadData = (ev: MouseEvent) => {
    setTimeout(() => {
      console.log('Done');
      ev.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (data.length == 1000) {
        ev.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll = () => {
    this.ionInfiniteScrollRef.disabled = !this.ionInfiniteScrollRef.disabled;
  }

  render() {
    return (
      <>
        <IonContent>
          <IonButton onClick="toggleInfiniteScroll()" expand="block">
            Toggle Infinite Scroll
          </IonButton>

          <IonList></IonList>

          <IonInfiniteScroll threshold="100px" onIonInfinite={(ev) => this.loadData(ev)}>
            <IonInfiniteScrollContent
              loadingSpinner="bubbles"
              loadingText="Loading more data...">
            </IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </>
    );
  }
}
```
