```html
<!-- Default Segment -->
<ion-segment (ionChange)="segmentChanged($event)">
  <ion-segment-button value="friends">
    Friends
  </ion-segment-button>
  <ion-segment-button value="enemies">
    Enemies
  </ion-segment-button>
</ion-segment>

<!-- Disabled Segment -->
<ion-segment (ionChange)="segmentChanged($event)" disabled>
  <ion-segment-button value="sunny" checked>
    Sunny
  </ion-segment-button>
  <ion-segment-button value="rainy">
    Rainy
  </ion-segment-button>
</ion-segment>

<!-- Segment with anchors -->
<ion-segment (ionChange)="segmentChanged($event)">
  <ion-segment-button href="#dogs" value="dogs">
    Dogs
  </ion-segment-button>
  <ion-segment-button href="#cats" value="cats">
    Cats
  </ion-segment-button>
</ion-segment>

<!-- Segment with secondary color -->
<ion-segment (ionChange)="segmentChanged($event)" color="secondary">
  <ion-segment-button value="standard">
    Standard
  </ion-segment-button>
  <ion-segment-button value="hybrid">
    Hybrid
  </ion-segment-button>
  <ion-segment-button value="sat">
    Satellite
  </ion-segment-button>
</ion-segment>

<!-- Segment in a toolbar -->
<ion-toolbar>
  <ion-segment (ionChange)="segmentChanged($event)">
    <ion-segment-button value="camera">
      <ion-icon name="camera"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="bookmark">
      <ion-icon name="bookmark"></ion-icon>
    </ion-segment-button>
  </ion-segment>
</ion-toolbar>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'segment-example',
  templateUrl: 'segment-example.html',
  styleUrls: ['./segment-example.css'],
})
export class SegmentExample {
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
}
```
