```tsx
import React from 'react';

import { IonAvatar } from '@ionic/react';

const Example: React.SFC<{}> = () => (

  <IonContent>
    <IonButton onClick="toggleInfiniteScroll()" expand="block">
      Toggle Infinite Scroll
    </IonButton>

    <IonList></IonList>

    <IonInfinite-scroll threshold="100px" (ionInfinite)="loadData($event)">
      <IonInfinite-scrollContent
        loadingSpinner="bubbles"
        loadingText="Loading more data...">
      </IonInfinite-scrollContent>
    </IonInfinite-scroll>
  </IonContent>



  import { Component, ViewChild } from '@angular/core';
  import { IonInfiniteScroll } from '@ionic/angular';

  @Component({
    selector: 'infinite-scroll-example',
    templateUrl: 'infinite-scroll-example.html',
    styleUrls: ['./infinite-scroll-example.css']
  })
  export class InfiniteScrollExample {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    constructor() {}

    loadData(event) {
      setTimeout(() => {
        console.log('Done');
        event.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (data.length == 1000) {
          event.target.disabled = true;
        }
      }, 500);
    }

    toggleInfiniteScroll() {
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }
  }


);

export default Example
