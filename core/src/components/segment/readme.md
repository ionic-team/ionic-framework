# ion-segment

Segments display a group of related buttons, sometimes known as segmented controls, in a horizontal row. They can be displayed inside of a toolbar or the main content.

Their functionality is similar to tabs, where selecting one will deselect all others. Segments are useful for toggling between different views inside of the content. Tabs should be used instead of a segment when clicking on a control should navigate between pages.


<!-- Auto Generated Below -->


## Usage

### Angular

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

<!-- Scrollable Segment -->
<ion-segment scrollable>
  <ion-segment-button>
    <ion-icon name="home"></ion-icon>
  </ion-segment-button>
  <ion-segment-button checked>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="star"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="globe"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="basket"></ion-icon>
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


### Javascript

```html
<!-- Default Segment -->
<ion-segment>
  <ion-segment-button value="friends">
    Friends
  </ion-segment-button>
  <ion-segment-button value="enemies">
    Enemies
  </ion-segment-button>
</ion-segment>

<!-- Disabled Segment -->
<ion-segment disabled>
  <ion-segment-button value="sunny" checked>
    Sunny
  </ion-segment-button>
  <ion-segment-button value="rainy">
    Rainy
  </ion-segment-button>
</ion-segment>

<!-- Segment with anchors -->
<ion-segment>
  <ion-segment-button href="#dogs" value="dogs">
    Dogs
  </ion-segment-button>
  <ion-segment-button href="#cats" value="cats">
    Cats
  </ion-segment-button>
</ion-segment>

<!-- Scrollable Segment -->
<ion-segment scrollable>
  <ion-segment-button>
    <ion-icon name="home"></ion-icon>
  </ion-segment-button>
  <ion-segment-button checked>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="star"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="globe"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="basket"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Segment with secondary color -->
<ion-segment color="secondary">
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
  <ion-segment>
    <ion-segment-button value="camera">
      <ion-icon name="camera"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="bookmark">
      <ion-icon name="bookmark"></ion-icon>
    </ion-segment-button>
  </ion-segment>
</ion-toolbar>
```

```javascript
// Listen for ionChange on all segments
const segments = document.querySelectorAll('ion-segment')
for (let i = 0; i < segments.length; i++) {
  segments[i].addEventListener('ionChange', (ev) => {
    console.log('Segment changed', ev);
  })
}
```



## Properties

| Property     | Attribute    | Description                                                                                                                                                                                                                                                            | Type                          | Default     |
| ------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------- |
| `color`      | `color`      | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`         | `undefined` |
| `disabled`   | `disabled`   | If `true`, the user cannot interact with the segment.                                                                                                                                                                                                                  | `boolean`                     | `false`     |
| `mode`       | `mode`       | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`               | `undefined` |
| `scrollable` | `scrollable` | If `true`, the segment buttons will overflow and the user can swipe to see them.                                                                                                                                                                                       | `boolean`                     | `false`     |
| `value`      | `value`      | the value of the segment.                                                                                                                                                                                                                                              | `null \| string \| undefined` | `undefined` |


## Events

| Event       | Description                                  | Detail               |
| ----------- | -------------------------------------------- | -------------------- |
| `ionChange` | Emitted when the value property has changed. | TextInputChangeEvent |
| `ionStyle`  | Emitted when the styles change.              | StyleEvent           |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
