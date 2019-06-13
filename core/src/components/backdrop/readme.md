# ion-backdrop

Backdrops are full screen components that overlay other components. They are useful behind components that transition in on top of other content and can be used to dismiss that component.


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default backdrop -->
<ion-backdrop></ion-backdrop>

<!-- Backdrop that is not tappable -->
<ion-backdrop tappable="false"></ion-backdrop>

<!-- Backdrop that is not visible -->
<ion-backdrop visible="false"></ion-backdrop>

<!-- Backdrop with propagation -->
<ion-backdrop stopPropagation="false"></ion-backdrop>

<!-- Backdrop that sets dynamic properties -->
<ion-backdrop
  [tappable]="enableBackdropDismiss"
  [visible]="showBackdrop"
  [stopPropagation]="shouldPropagate">
</ion-backdrop>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'backdrop-example',
  templateUrl: 'backdrop-example.html',
  styleUrls: ['./backdrop-example.css'],
})
export class BackdropExample {
  backdropDismiss = false;
  showBackdrop = false;
  shouldPropagate = false;
}
```


### Javascript

```html
<!-- Default backdrop -->
<ion-backdrop></ion-backdrop>

<!-- Backdrop that is not tappable -->
<ion-backdrop tappable="false"></ion-backdrop>

<!-- Backdrop that is not visible -->
<ion-backdrop visible="false"></ion-backdrop>

<!-- Backdrop with propagation -->
<ion-backdrop stop-propagation="false"></ion-backdrop>

<!-- Backdrop that sets dynamic properties -->
<ion-backdrop id="customBackdrop"></ion-backdrop>
```

```javascript
var backdrop = document.getElementById('customBackdrop');
backdrop.visible = false;
backdrop.tappable = false;
backdrop.stopPropagation = false;
```


### React

```tsx
import React from 'react';
import { IonBackdrop, IonContent } from '@ionic/react';

export const BackdropExample: React.FunctionComponent = () => (
  <IonContent>
    {/*-- Default backdrop --*/}
    <IonBackdrop />

    {/*-- Backdrop that is not tappable --*/}
    <IonBackdrop tappable={false} />

    {/*-- Backdrop that is not visible --*/}
    <IonBackdrop visible={false} />

    {/*-- Backdrop with propagation --*/}
    <IonBackdrop stopPropagation={false} />

    <IonBackdrop tappable={true} visible={true} stopPropagation={true} />
  </IonContent>
);
```


### Vue

```html
<template>
  <!-- Default backdrop -->
  <ion-backdrop></ion-backdrop>

  <!-- Backdrop that is not tappable -->
  <ion-backdrop tappable="false"></ion-backdrop>

  <!-- Backdrop that is not visible -->
  <ion-backdrop visible="false"></ion-backdrop>

  <!-- Backdrop with propagation -->
  <ion-backdrop stopPropagation="false"></ion-backdrop>

  <!-- Backdrop that sets dynamic properties -->
  <ion-backdrop
    :tappable="enableBackdropDismiss"
    :visible="showBackdrop"
    :stopPropagation="shouldPropagate">
  </ion-backdrop>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    backdropDismiss = false;
    showBackdrop = false;
    shouldPropagate = false;
  }
</script>
```



## Properties

| Property          | Attribute          | Description                                                                           | Type      | Default |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------- | --------- | ------- |
| `stopPropagation` | `stop-propagation` | If `true`, the backdrop will stop propagation on tap.                                 | `boolean` | `true`  |
| `tappable`        | `tappable`         | If `true`, the backdrop will can be clicked and will emit the `ionBackdropTap` event. | `boolean` | `true`  |
| `visible`         | `visible`          | If `true`, the backdrop will be visible.                                              | `boolean` | `true`  |


## Events

| Event            | Description                          | Type                |
| ---------------- | ------------------------------------ | ------------------- |
| `ionBackdropTap` | Emitted when the backdrop is tapped. | `CustomEvent<void>` |


## Dependencies

### Used by

 - [ion-action-sheet](../action-sheet)
 - [ion-alert](../alert)
 - [ion-loading](../loading)
 - [ion-menu](../menu)
 - [ion-modal](../modal)
 - [ion-picker](../picker)
 - [ion-popover](../popover)

### Graph
```mermaid
graph TD;
  ion-action-sheet --> ion-backdrop
  ion-alert --> ion-backdrop
  ion-loading --> ion-backdrop
  ion-menu --> ion-backdrop
  ion-modal --> ion-backdrop
  ion-picker --> ion-backdrop
  ion-popover --> ion-backdrop
  style ion-backdrop fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
