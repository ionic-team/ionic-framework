```html
<!-- Segment buttons with text and click listener -->
<ion-segment (ionChange)="segmentChanged($event)">
  <ion-segment-button>
    <ion-label>Friends</ion-label>
  </ion-segment-button>
  <ion-segment-button>
    <ion-label>Enemies</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Segment buttons with the first checked and the last disabled -->
<ion-segment value="paid">
  <ion-segment-button value="paid">
    <ion-label>Paid</ion-label>
  </ion-segment-button>
  <ion-segment-button value="free">
    <ion-label>Free</ion-label>
  </ion-segment-button>
  <ion-segment-button disabled value="top">
    <ion-label>Top</ion-label>
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
    <ion-label>Bookmarks</ion-label>
  </ion-segment-button>
  <ion-segment-button value="reading">
    <ion-label>Reading List</ion-label>
  </ion-segment-button>
  <ion-segment-button value="shared">
    <ion-label>Shared Links</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Label only -->
<ion-segment value="1">
  <ion-segment-button value="1">
    <ion-label>Item One</ion-label>
  </ion-segment-button>
  <ion-segment-button value="2">
    <ion-label>Item Two</ion-label>
  </ion-segment-button>
  <ion-segment-button value="3">
    <ion-label>Item Three</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Icon only -->
<ion-segment value="heart">
  <ion-segment-button value="call">
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button value="heart">
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button value="pin">
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Icon top -->
<ion-segment value="2">
  <ion-segment-button value="1">
    <ion-label>Item One</ion-label>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button value="2">
    <ion-label>Item Two</ion-label>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button value="3">
    <ion-label>Item Three</ion-label>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Icon bottom -->
<ion-segment value="1">
  <ion-segment-button value="1" layout="icon-bottom">
    <ion-icon name="call"></ion-icon>
    <ion-label>Item One</ion-label>
  </ion-segment-button>
  <ion-segment-button value="2" layout="icon-bottom">
    <ion-icon name="heart"></ion-icon>
    <ion-label>Item Two</ion-label>
  </ion-segment-button>
  <ion-segment-button value="3" layout="icon-bottom">
    <ion-icon name="pin"></ion-icon>
    <ion-label>Item Three</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Icon start -->
<ion-segment value="1">
  <ion-segment-button value="1" layout="icon-start">
    <ion-label>Item One</ion-label>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button value="2" layout="icon-start">
    <ion-label>Item Two</ion-label>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button value="3" layout="icon-start">
    <ion-label>Item Three</ion-label>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Icon end -->
<ion-segment value="1">
  <ion-segment-button value="1" layout="icon-end">
    <ion-icon name="call"></ion-icon>
    <ion-label>Item One</ion-label>
  </ion-segment-button>
  <ion-segment-button value="2" disabled layout="icon-end">
    <ion-icon name="heart"></ion-icon>
    <ion-label>Item Two</ion-label>
  </ion-segment-button>
  <ion-segment-button value="3" layout="icon-end">
    <ion-icon name="pin"></ion-icon>
    <ion-label>Item Three</ion-label>
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
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
}
```