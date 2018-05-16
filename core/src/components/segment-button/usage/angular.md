
```html
<!-- Segment buttons with text and click listeners -->
<ion-segment>
  <ion-segment-button (ionSelect)="segmentButtonClicked($event)">
    Friends
  </ion-segment-button>
  <ion-segment-button (ionSelect)="segmentButtonClicked($event)">
    Enemies
  </ion-segment-button>
</ion-segment>

<!-- Segment buttons with the first checked and the last disabled -->
<ion-segment>
  <ion-segment-button checked>
    Paid
  </ion-segment-button>
  <ion-segment-button>
    Free
  </ion-segment-button>
  <ion-segment-button disabled>
    Top
  </ion-segment-button>
</ion-segment>

<!-- Segment buttons with values and icons -->
<ion-segment>
  <ion-segment-button value="camera">
    <ion-icon name="camera"></ion-icon>
  </ion-segment-button>
  <ion-segment-button value="bookmark">
    <ion-icon name="bookmark"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Segment with a value that checks the last button -->
<ion-segment value="shared">
  <ion-segment-button value="bookmarks">
    Bookmarks
  </ion-segment-button>
  <ion-segment-button value="reading">
    Reading List
  </ion-segment-button>
  <ion-segment-button value="shared">
    Shared Links
  </ion-segment-button>
</ion-segment>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'segment-button-example',
  templateUrl: 'segment-button-example.html',
  styleUrls: ['./segment-button-example.css'],
})
export class SegmentButtonExample {
  segmentButtonClicked(ev: any) {
    console.log('Segment button clicked', ev);
  }
}
```