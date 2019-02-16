```html
<ion-content>
  <ion-button (click)="toggleInfiniteScroll()" expand="block">
    Toggle Infinite Scroll
  </ion-button>

  <ion-list></ion-list>

  <ion-infinite-scroll threshold="100px" (ionInfinite)="loadData($event)">
    <ion-infinite-scroll-content
      loadingSpinner="bubbles"
      loadingText="Loading more data...">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ion-content>
```

```typescript
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
```
