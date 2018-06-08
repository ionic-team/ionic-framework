```html
  <ion-content id="content">
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
import { Component } from '@angular/core';

@Component({
  selector: 'infinite-scroll-example',
  templateUrl: 'infinite-scroll-example.html',
  styleUrls: ['./infinite-scroll-example.css']
})
export class InfiniteScrollExample {
  constructor() {}

  loadData(event) {
    setTimeout(function() {
      console.log('Done');
      event.target.complete();
    }, 2000);
  }
}
```
