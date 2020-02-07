# ion-drawer

The Drawer component is a lightweight drawer slide-over pane. For modern progressive applications.

Adopted from Cupertino Pane:
Modern slide-over pane drawer with touch technologies. Right like in Apple Maps, Apple Stocks, Apple Music and other modern apps.

https://github.com/roman-rr/cupertino-pane/

Copyright 2020, Roman Antonov

Licensed under MIT

<!-- Auto Generated Below -->


## Usage

### Angular

```typescript
import { Component, OnInit } from '@angular/core';
import { IonDrawer } from '@ionic/angular';

@Component({
  selector: 'drawer-example',
  template: `
    <ion-drawer #pane [options]="drawerOpts" presentDefault="true">
      <h1>Header</h1>
      <div>Content</div> 
    </ion-drawer>
  `
})
export class DrawerExample implements OnInit {
  @ViewChild('pane', {read: IonDrawer, static: false}) drawer: IonDrawer;

  // Optional parameters to pass to the drawer instance. See https://github.com/roman-rr/cupertino-pane/ for valid options.
  public drawerOpts = {
    showDraggable: true,
    breaks: {
      top: { enabled: false, offset: 0 },
      middle: { enabled: true, offset: 0 },
      bottom: { enabled: true, offset: 0 },
    }
  };

  constructor() {}

  hideDrawer() {
    drawer.hide();
  }
}
```


### Javascript

```html
  <ion-drawer presentDefault="true">
    <h1>Header</h1>
    <div>Content</div> 
  </ion-drawer>
```

```javascript
var drawer = document.querySelector('ion-drawer');
    
// Optional parameters to pass to the drawer instance. See https://github.com/roman-rr/cupertino-pane/ for valid options.
drawer.options = {
  showDraggable: true,
  breaks: {
    top: { enabled: false, offset: 0 },
    middle: { enabled: true, offset: 0 },
    bottom: { enabled: true, offset: 0 },
  }
}
```


### React

```tsx
import React from 'react';
import { IonDrawer, IonContent } from '@ionic/react';

// Optional parameters to pass to the drawer instance. See https://github.com/roman-rr/cupertino-pane/ for valid options.
const drawerOpts = {
  showDraggable: true,
  breaks: {
    top: { enabled: false, offset: 0 },
    middle: { enabled: true, offset: 0 },
    bottom: { enabled: true, offset: 0 },
  }
};

export const DrawerExample: React.FC = () => (
  <IonContent>
    <ion-drawer options={drawerOpts} presentDefault={true}>
      <h1>Header</h1>
      <div>Content</div> 
    </ion-drawer>
  </IonContent>
);
```


### Vue

```html
<template>
  <ion-drawer presentDefault="true" :options="drawerOpts">
    <h1>Header</h1>
    <div>Content</div> 
  </ion-drawer>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    // Optional parameters to pass to the drawer instance. See https://github.com/roman-rr/cupertino-pane/ for valid options.
    drawerOpts = {
      showDraggable: true,
      breaks: {
        top: { enabled: false, offset: 0 },
        middle: { enabled: true, offset: 0 },
        bottom: { enabled: true, offset: 0 },
      }
    };
  }
</script>
```



## Properties

| Property         | Attribute         | Description                                                                                               | Type            | Default     |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| `mode`           | `mode`            | The mode determines which platform styles to use.                                                         | `"ios" \| "md"` | `undefined` |
| `options`        | `options`         | Options to pass to the drawer instance. See https://github.com/roman-rr/cupertino-pane/ for valid options | `any`           | `{}`        |
| `presentDefault` | `present-default` | If `true`, show the drawer right after component loaded.                                                  | `boolean`       | `false`     |


## Events

| Event                    | Description                                 | Type                |
| ------------------------ | ------------------------------------------- | ------------------- |
| `ionDrawerDidDismiss`    | Emitted after pane will dissapeared         | `CustomEvent<void>` |
| `ionDrawerDragStart`     | Emitted when detect user drag event on pane | `CustomEvent<void>` |
| `ionDrawerOnDrag`        | Emitted executes on each new pane position  | `CustomEvent<void>` |
| `ionDrawerTransitionEnd` | Emitted after pane will present             | `CustomEvent<void>` |
| `ionDrawerWillDismiss`   | Emitted before pane will dissapeared        | `CustomEvent<void>` |
| `ionDrawerWillPresent`   | Emitted before panel will present           | `CustomEvent<void>` |


## Methods

### `destroy(conf?: {}) => Promise<void>`

Remove pane from DOM and clear styles

#### Returns

Type: `Promise<void>`



### `getDrawer() => Promise<any>`

Use this to access the full Drawer API.

#### Returns

Type: `Promise<any>`



### `hide() => Promise<void>`

Dissappear pane from screen, still keep pane in DOM

#### Returns

Type: `Promise<void>`



### `isHidden() => Promise<boolean | null>`

Determinate if drawer position was moved out of screen, but pane still exist in DOM.

#### Returns

Type: `Promise<boolean | null>`



### `moveToBreak(val: "top" | "middle" | "bottom") => Promise<void>`

Will change pane position with animation to selected breakpoint

#### Returns

Type: `Promise<void>`



### `present(conf?: {}) => Promise<void>`

Render and show Drawer pane from ion-drawer component

#### Returns

Type: `Promise<void>`



### `update() => Promise<void>`

Update the underlying Drawer implementation.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
