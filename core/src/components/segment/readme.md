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
    <ion-label>Friends</ion-label>
  </ion-segment-button>
  <ion-segment-button value="enemies">
    <ion-label>Enemies</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Disabled Segment -->
<ion-segment (ionChange)="segmentChanged($event)" disabled>
  <ion-segment-button value="sunny" checked>
    <ion-label>Sunny</ion-label>
  </ion-segment-button>
  <ion-segment-button value="rainy">
    <ion-label>Rainy</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Segment with anchors -->
<ion-segment (ionChange)="segmentChanged($event)">
  <ion-segment-button href="#dogs" value="dogs">
    <ion-label>Dogs</ion-label>
  </ion-segment-button>
  <ion-segment-button href="#cats" value="cats">
    <ion-label>Cats</ion-label>
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
    <ion-label>Standard</ion-label>
  </ion-segment-button>
  <ion-segment-button value="hybrid">
    <ion-label>Hybrid</ion-label>
  </ion-segment-button>
  <ion-segment-button value="sat">
    <ion-label>Satellite</ion-label>
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

<!-- Segment with default selection -->
<ion-segment (ionChange)="segmentChanged($event)" value="javascript">
  <ion-segment-button value="python">
    <ion-label>Python</ion-label>
  </ion-segment-button>
  <ion-segment-button value="javascript">
    <ion-label>Javascript</ion-label>
  </ion-segment-button>
</ion-segment>
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
    <ion-label>Friends</ion-label>
  </ion-segment-button>
  <ion-segment-button value="enemies">
    <ion-label>Enemies</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Disabled Segment -->
<ion-segment disabled>
  <ion-segment-button value="sunny" checked>
    <ion-label>Sunny</ion-label>
  </ion-segment-button>
  <ion-segment-button value="rainy">
    <ion-label>Rainy</ion-label>
  </ion-segment-button>
</ion-segment>

<!-- Segment with anchors -->
<ion-segment>
  <ion-segment-button href="#dogs" value="dogs">
    <ion-label>Dogs</ion-label>
  </ion-segment-button>
  <ion-segment-button href="#cats" value="cats">
    <ion-label>Cats</ion-label>
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
    <ion-label>Standard</ion-label>
  </ion-segment-button>
  <ion-segment-button value="hybrid">
    <ion-label>Hybrid</ion-label>
  </ion-segment-button>
  <ion-segment-button value="sat">
    <ion-label>Satellite</ion-label>
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

<!-- Segment with default selection -->
<ion-segment value="javascript">
  <ion-segment-button value="python">
    <ion-label>Python</ion-label>
  </ion-segment-button>
  <ion-segment-button value="javascript">
    <ion-label>Javascript</ion-label>
  </ion-segment-button>
</ion-segment>
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


### React

```tsx
import React from 'react';
import { IonSegment, IonSegmentButton, IonLabel, IonIcon, IonToolbar, IonContent } from '@ionic/react';

export const SegmentExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default Segment --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
      <IonSegmentButton value="friends">
        <IonLabel>Friends</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="enemies">
        <IonLabel>Enemies</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Disabled Segment --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)} disabled>
      <IonSegmentButton value="sunny" checked>
        <IonLabel>Sunny</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="rainy">
        <IonLabel>Rainy</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Segment with anchors --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
      <IonSegmentButton value="dogs">
        <IonLabel>Dogs</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="cats">
        <IonLabel>Cats</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Scrollable Segment --*/}
    <IonSegment scrollable>
      <IonSegmentButton>
        <IonIcon name="home" />
      </IonSegmentButton>
      <IonSegmentButton checked>
        <IonIcon name="heart" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="pin" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="star" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="call" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="globe" />
      </IonSegmentButton>
      <IonSegmentButton>
        <IonIcon name="basket" />
      </IonSegmentButton>
    </IonSegment>

    {/*-- Segment with secondary color --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)} color="secondary">
      <IonSegmentButton value="standard">
        <IonLabel>Standard</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="hybrid">
        <IonLabel>Hybrid</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="sat">
        <IonLabel>Satellite</IonLabel>
      </IonSegmentButton>
    </IonSegment>

    {/*-- Segment in a toolbar --*/}
    <IonToolbar>
      <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
        <IonSegmentButton value="camera">
          <IonIcon name="camera" />
        </IonSegmentButton>
        <IonSegmentButton value="bookmark">
          <IonIcon name="bookmark" />
        </IonSegmentButton>
      </IonSegment>
    </IonToolbar>

    {/*-- Segment with default selection --*/}
    <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)} value="javascript">
      <IonSegmentButton value="python">
        <IonLabel>Python</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="javascript">
        <IonLabel>Javascript</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  </IonContent>
);
```


### Vue

```html
<template>
  <!-- Default Segment -->
  <ion-segment @ionChange="segmentChanged($event)">
    <ion-segment-button value="friends">
      <ion-label>Friends</ion-label>
    </ion-segment-button>
    <ion-segment-button value="enemies">
      <ion-label>Enemies</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Disabled Segment -->
  <ion-segment @ionChange="segmentChanged($event)" disabled>
    <ion-segment-button value="sunny" checked>
      <ion-label>Sunny</ion-label>
    </ion-segment-button>
    <ion-segment-button value="rainy">
      <ion-label>Rainy</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment with anchors -->
  <ion-segment @ionChange="segmentChanged($event)">
    <ion-segment-button href="#dogs" value="dogs">
      <ion-label>Dogs</ion-label>
    </ion-segment-button>
    <ion-segment-button href="#cats" value="cats">
      <ion-label>Cats</ion-label>
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
  <ion-segment @ionChange="segmentChanged($event)" color="secondary">
    <ion-segment-button value="standard">
      <ion-label>Standard</ion-label>
    </ion-segment-button>
    <ion-segment-button value="hybrid">
      <ion-label>Hybrid</ion-label>
    </ion-segment-button>
    <ion-segment-button value="sat">
      <ion-label>Satellite</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment in a toolbar -->
  <ion-toolbar>
    <ion-segment @ionChange="segmentChanged($event)">
      <ion-segment-button value="camera">
        <ion-icon name="camera"></ion-icon>
      </ion-segment-button>
      <ion-segment-button value="bookmark">
        <ion-icon name="bookmark"></ion-icon>
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>

  <!-- Segment with default selection -->
  <ion-segment @ionChange="segmentChanged($event)" value="javascript">
    <ion-segment-button value="python">
      <ion-label>Python</ion-label>
    </ion-segment-button>
    <ion-segment-button value="javascript">
      <ion-label>Javascript</ion-label>
    </ion-segment-button>
  </ion-segment>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    segmentChanged(ev: any) {
      console.log('Segment changed', ev);
    }
  }
</script>
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

| Event       | Description                                  | Type                                    |
| ----------- | -------------------------------------------- | --------------------------------------- |
| `ionChange` | Emitted when the value property has changed. | `CustomEvent<SegmentChangeEventDetail>` |
| `ionStyle`  | Emitted when the styles change.              | `CustomEvent<StyleEventDetail>`         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
