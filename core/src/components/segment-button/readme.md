# ion-segment-button

Segment buttons are groups of related buttons inside of a [Segment](../../segment/Segment). They are displayed in a horizontal row. A segment button can be checked by default by adding the `checked` attribute or by setting the `value` of the segment to the `value` of the segment button. Only one segment button should be selected at a time.


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Segment buttons with text and click listeners -->
<ion-segment>
  <ion-segment-button (ionSelect)="segmentButtonClicked($event)">
    <ion-label>Friends</ion-label>
  </ion-segment-button>
  <ion-segment-button (ionSelect)="segmentButtonClicked($event)">
    <ion-label>Enemies</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Segment buttons with the first checked and the last disabled -->
<ion-segment>
  <ion-segment-button checked>
    <ion-label>Paid</ion-label>
  </ion-segment-button>
  <ion-segment-button>
    <ion-label>Free</ion-label>
  </ion-segment-button>
  <ion-segment-button disabled>
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
<ion-segment>
  <ion-segment-button checked>
    <ion-label>Item One</ion-label>
  </ion-segment-button>
  <ion-segment-button>
    <ion-label>Item Two</ion-label>
  </ion-segment-button>
  <ion-segment-button>
    <ion-label>Item Three</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Icon only -->
<ion-segment>
  <ion-segment-button>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button checked>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Icon top -->
<ion-segment>
  <ion-segment-button layout="icon-top">
    <ion-label>Item One</ion-label>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button checked layout="icon-top">
    <ion-label>Item Two</ion-label>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button layout="icon-top">
    <ion-label>Item Three</ion-label>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Icon bottom -->
<ion-segment>
  <ion-segment-button checked layout="icon-bottom">
    <ion-icon name="call"></ion-icon>
    <ion-label>Item One</ion-label>
  </ion-segment-button>
  <ion-segment-button layout="icon-bottom">
    <ion-icon name="heart"></ion-icon>
    <ion-label>Item Two</ion-label>
  </ion-segment-button>
  <ion-segment-button layout="icon-bottom">
    <ion-icon name="pin"></ion-icon>
    <ion-label>Item Three</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Icon start -->
<ion-segment>
  <ion-segment-button checked layout="icon-start">
    <ion-label>Item One</ion-label>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button layout="icon-start">
    <ion-label>Item Two</ion-label>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button layout="icon-start">
    <ion-label>Item Three</ion-label>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Icon end -->
<ion-segment>
  <ion-segment-button checked layout="icon-end">
    <ion-icon name="call"></ion-icon>
    <ion-label>Item One</ion-label>
  </ion-segment-button>
  <ion-segment-button disabled layout="icon-end">
    <ion-icon name="heart"></ion-icon>
    <ion-label>Item Two</ion-label>
  </ion-segment-button>
  <ion-segment-button layout="icon-end">
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
  segmentButtonClicked(ev: any) {
    console.log('Segment button clicked', ev);
  }
}
```

### Javascript

```html
<!-- Segment buttons with text -->
<ion-segment>
  <ion-segment-button>
    <ion-label>Friends</ion-label>
  </ion-segment-button>
  <ion-segment-button>
    <ion-label>Enemies</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Segment buttons with the first checked and the last disabled -->
<ion-segment>
  <ion-segment-button checked>
    <ion-label>Paid</ion-label>
  </ion-segment-button>
  <ion-segment-button>
    <ion-label>Free</ion-label>
  </ion-segment-button>
  <ion-segment-button disabled>
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
<ion-segment>
  <ion-segment-button checked>
    <ion-label>Item One</ion-label>
  </ion-segment-button>
  <ion-segment-button>
    <ion-label>Item Two</ion-label>
  </ion-segment-button>
  <ion-segment-button>
    <ion-label>Item Three</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Icon only -->
<ion-segment>
  <ion-segment-button>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button checked>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Icon top -->
<ion-segment>
  <ion-segment-button layout="icon-top">
    <ion-label>Item One</ion-label>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button checked layout="icon-top">
    <ion-label>Item Two</ion-label>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button layout="icon-top">
    <ion-label>Item Three</ion-label>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Icon bottom -->
<ion-segment>
  <ion-segment-button checked layout="icon-bottom">
    <ion-icon name="call"></ion-icon>
    <ion-label>Item One</ion-label>
  </ion-segment-button>
  <ion-segment-button layout="icon-bottom">
    <ion-icon name="heart"></ion-icon>
    <ion-label>Item Two</ion-label>
  </ion-segment-button>
  <ion-segment-button layout="icon-bottom">
    <ion-icon name="pin"></ion-icon>
    <ion-label>Item Three</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Icon start -->
<ion-segment>
  <ion-segment-button checked layout="icon-start">
    <ion-label>Item One</ion-label>
    <ion-icon name="call"></ion-icon>
  </ion-segment-button>
  <ion-segment-button layout="icon-start">
    <ion-label>Item Two</ion-label>
    <ion-icon name="heart"></ion-icon>
  </ion-segment-button>
  <ion-segment-button layout="icon-start">
    <ion-label>Item Three</ion-label>
    <ion-icon name="pin"></ion-icon>
  </ion-segment-button>
</ion-segment>

<!-- Icon end -->
<ion-segment>
  <ion-segment-button checked layout="icon-end">
    <ion-icon name="call"></ion-icon>
    <ion-label>Item One</ion-label>
  </ion-segment-button>
  <ion-segment-button disabled layout="icon-end">
    <ion-icon name="heart"></ion-icon>
    <ion-label>Item Two</ion-label>
  </ion-segment-button>
  <ion-segment-button layout="icon-end">
    <ion-icon name="pin"></ion-icon>
    <ion-label>Item Three</ion-label>
  </ion-segment-button>
</ion-segment>
```

```javascript
// Listen for ionClick on all segment buttons
const segmentButtons = document.querySelectorAll('ion-segment-button')
for (let i = 0; i < segmentButtons.length; i++) {
  segmentButtons[i].addEventListener('ionSelect', (ev) => {
    console.log('Segment button clicked', ev);
  })
}
```


## Properties

| Property   | Attribute  | Description                                                                                                                                                                                                                                                            | Type                                                                                                    | Default               |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------- |
| `checked`  | `checked`  | If `true`, the segment button is selected.                                                                                                                                                                                                                             | `boolean`                                                                                               | `false`               |
| `color`    | `color`    | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`                                                                                   | `undefined`           |
| `disabled` | `disabled` | If `true`, the user cannot interact with the segment button.                                                                                                                                                                                                           | `boolean`                                                                                               | `false`               |
| `layout`   | `layout`   | Set the layout of the text and icon in the segment.                                                                                                                                                                                                                    | `"icon-bottom" \| "icon-end" \| "icon-hide" \| "icon-start" \| "icon-top" \| "label-hide" \| undefined` | `undefined`           |
| `mode`     | `mode`     | The mode determines which platform styles to use.                                                                                                                                                                                                                      | `"ios" \| "md"`                                                                                         | `undefined`           |
| `value`    | `value`    | The value of the segment button.                                                                                                                                                                                                                                       | `string`                                                                                                | `'ion-sb-' + (ids++)` |


## Events

| Event       | Description                                 | Detail |
| ----------- | ------------------------------------------- | ------ |
| `ionSelect` | Emitted when the segment button is clicked. | void   |


## CSS Custom Properties

| Name                        | Description                                                         |
| --------------------------- | ------------------------------------------------------------------- |
| `--background`              | Background of the segment button                                    |
| `--background-activated`    | Background of the activated (pressed) segment button                |
| `--background-checked`      | Background of the checked segment button                            |
| `--background-hover`        | Background of the segment button on hover                           |
| `--border-color`            | Color of the segment button border                                  |
| `--border-radius`           | Radius of the segment button border                                 |
| `--border-style`            | Style of the segment button border                                  |
| `--border-width`            | Width of the segment button border                                  |
| `--color`                   | Color of the segment button                                         |
| `--color-activated`         | Color of the activated (pressed) segment button                     |
| `--color-checked`           | Color of the checked segment button                                 |
| `--color-checked-disabled`  | Color of the checked & disabled segment button                      |
| `--color-disabled`          | Color of the disabled segment button                                |
| `--indicator-color`         | Color of the indicator (highlight) under the segment button         |
| `--indicator-color-checked` | Color of the indicator (highlight) under the checked segment button |
| `--margin-bottom`           | Bottom margin of the segment button                                 |
| `--margin-end`              | End margin of the segment button                                    |
| `--margin-start`            | Start margin of the segment button                                  |
| `--margin-top`              | Top margin of the segment button                                    |
| `--padding-bottom`          | Bottom padding of the segment button                                |
| `--padding-end`             | End padding of the segment button                                   |
| `--padding-start`           | Start padding of the segment button                                 |
| `--padding-top`             | Top padding of the segment button                                   |
| `--transition`              | Transition of the segment button                                    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
