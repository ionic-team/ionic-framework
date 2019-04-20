# ion-reorder-group

The reorder group is a wrapper component for items using the `ion-reorder` component. See the [Reorder documentation](../reorder/) for further information about the anchor component that is used to drag items within the `ion-reorder-group`.

Once the user drags an item and drops it in a new position, the `ionItemReorder` event is dispatched. A handler for it should be implemented that calls the `complete()` method.

The `detail` property of the `ionItemReorder` event includes all of the relevant information about the reorder operation, including the `from` and `to` indexes. In the context of reordering, an item moves `from` an index `to` a new index.

```js
reorderGroup.addEventListener('ionItemReorder', (ev) => {
  console.log(`Moving item from ${ev.detail.from} to ${ev.detail.to}`);

  this.dataList = reorderArray(this.dataList, ev.detail.from, ev.detail.to);
  ev.detail.complete();
});
```

Once the data structure has been updated to reflect the reorder change, the `complete()` method must be called.
This method finishes the reorder operation and resets all the CSS transforms applied by the `ion-reorder-group` component.

Fortunately this `complete()` method can optionally accept an array as input and it will return a reordered copy, based in `detail.from` and `detail.to`.

```ts
this.dataList = reorderGroup.complete(this.dataList);
```

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- The reorder gesture is disabled by default, enable it to drag and drop items -->
<ion-reorder-group (ionItemReorder)="doReorder($event)" disabled="false">
  <!-- Default reorder icon, end aligned items -->
  <ion-item>
    <ion-label>
      Item 1
    </ion-label>
    <ion-reorder slot="end"></ion-reorder>
  </ion-item>

  <ion-item>
    <ion-label>
      Item 2
    </ion-label>
    <ion-reorder slot="end"></ion-reorder>
  </ion-item>

  <!-- Default reorder icon, start aligned items -->
  <ion-item>
    <ion-reorder slot="start"></ion-reorder>
    <ion-label>
      Item 3
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-reorder slot="start"></ion-reorder>
    <ion-label>
      Item 4
    </ion-label>
  </ion-item>

  <!-- Custom reorder icon end items -->
  <ion-item>
    <ion-label>
      Item 5
    </ion-label>
    <ion-reorder slot="end">
      <ion-icon name="pizza"></ion-icon>
    </ion-reorder>
  </ion-item>

  <ion-item>
    <ion-label>
      Item 6
    </ion-label>
    <ion-reorder slot="end">
      <ion-icon name="pizza"></ion-icon>
    </ion-reorder>
  </ion-item>

  <!-- Items wrapped in a reorder, entire item can be dragged -->
  <ion-reorder>
    <ion-item>
      <ion-label>
        Item 7
      </ion-label>
    </ion-item>
  </ion-reorder>

  <ion-reorder>
    <ion-item>
      <ion-label>
        Item 8
      </ion-label>
    </ion-item>
  </ion-reorder>
</ion-reorder-group>
```

```javascript
import { Component, ViewChild } from '@angular/core';
import { IonReorderGroup } from '@ionic/angular';

@Component({
  selector: 'reorder-group-example',
  templateUrl: 'reorder-group-example.html',
  styleUrls: ['./reorder-group-example.css']
})
export class ReorderGroupExample {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  constructor() {}

  doReorder(ev: any) => {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  });

  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }
}
```


### Javascript

```html
<!-- The reorder gesture is disabled by default, enable it to drag and drop items -->
<ion-reorder-group disabled="false">
  <!-- Default reorder icon, end aligned items -->
  <ion-item>
    <ion-label>
      Item 1
    </ion-label>
    <ion-reorder slot="end"></ion-reorder>
  </ion-item>

  <ion-item>
    <ion-label>
      Item 2
    </ion-label>
    <ion-reorder slot="end"></ion-reorder>
  </ion-item>

  <!-- Default reorder icon, start aligned items -->
  <ion-item>
    <ion-reorder slot="start"></ion-reorder>
    <ion-label>
      Item 3
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-reorder slot="start"></ion-reorder>
    <ion-label>
      Item 4
    </ion-label>
  </ion-item>

  <!-- Custom reorder icon end items -->
  <ion-item>
    <ion-label>
      Item 5
    </ion-label>
    <ion-reorder slot="end">
      <ion-icon name="pizza"></ion-icon>
    </ion-reorder>
  </ion-item>

  <ion-item>
    <ion-label>
      Item 6
    </ion-label>
    <ion-reorder slot="end">
      <ion-icon name="pizza"></ion-icon>
    </ion-reorder>
  </ion-item>

  <!-- Items wrapped in a reorder, entire item can be dragged -->
  <ion-reorder>
    <ion-item>
      <ion-label>
        Item 7
      </ion-label>
    </ion-item>
  </ion-reorder>

  <ion-reorder>
    <ion-item>
      <ion-label>
        Item 8
      </ion-label>
    </ion-item>
  </ion-reorder>
</ion-reorder-group>
```

```javascript
const reorderGroup = document.querySelector('ion-reorder-group');

reorderGroup.addEventListener('ionItemReorder', ({detail}) => {
  // The `from` and `to` properties contain the index of the item
  // when the drag started and ended, respectively
  console.log('Dragged from index', detail.from, 'to', detail.to);

  // Finish the reorder and position the item in the DOM based on
  // where the gesture ended. This method can also be called directly
  // by the reorder group
  detail.complete();
});
```


### React

```tsx
import React from 'react';

import { IonItem, IonLabel, IonReorder, IonReorderGroup, IonIcon } from '@ionic/react';

function doReorder(event: CustomEvent) {
  // The `from` and `to` properties contain the index of the item
  // when the drag started and ended, respectively
  console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

  // Finish the reorder and position the item in the DOM based on
  // where the gesture ended. This method can also be called directly
  // by the reorder group
  event.detail.complete();
}

const Example: React.SFC<{}> = () => (
  <>
    {/*-- The reorder gesture is disabled by default, enable it to drag and drop items --*/}
    <IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
      {/*-- Default reorder icon, end aligned items --*/}
      <IonItem>
        <IonLabel>
          Item 1
        </IonLabel>
        <IonReorder slot="end"></IonReorder>
      </IonItem>

      <IonItem>
        <IonLabel>
          Item 2
        </IonLabel>
        <IonReorder slot="end"></IonReorder>
      </IonItem>

      {/*-- Default reorder icon, start aligned items --*/}
      <IonItem>
        <IonReorder slot="start"></IonReorder>
        <IonLabel>
          Item 3
        </IonLabel>
      </IonItem>

      <IonItem>
        <IonReorder slot="start"></IonReorder>
        <IonLabel>
          Item 4
        </IonLabel>
      </IonItem>

      {/*-- Custom reorder icon end items --*/}
      <IonItem>
        <IonLabel>
          Item 5
        </IonLabel>
        <IonReorder slot="end">
          <IonIcon name="pizza"></IonIcon>
        </IonReorder>
      </IonItem>

      <IonItem>
        <IonLabel>
          Item 6
        </IonLabel>
        <IonReorder slot="end">
          <IonIcon name="pizza"></IonIcon>
        </IonReorder>
      </IonItem>

      {/*-- Items wrapped in a reorder, entire item can be dragged --*/}
      <IonReorder>
        <IonItem>
          <IonLabel>
            Item 7
          </IonLabel>
        </IonItem>
      </IonReorder>

      <IonReorder>
        <IonItem>
          <IonLabel>
            Item 8
          </IonLabel>
        </IonItem>
      </IonReorder>
    </IonReorderGroup>
  </>
  }
);

export default Example


### Vue

```html
<template>
  <!-- The reorder gesture is disabled by default, enable it to drag and drop items -->
  <ion-reorder-group @ionItemReorder="doReorder($event)" disabled="false">
    <!-- Default reorder icon, end aligned items -->
    <ion-item>
      <ion-label>
        Item 1
      </ion-label>
      <ion-reorder slot="end"></ion-reorder>
    </ion-item>

    <ion-item>
      <ion-label>
        Item 2
      </ion-label>
      <ion-reorder slot="end"></ion-reorder>
    </ion-item>

    <!-- Default reorder icon, start aligned items -->
    <ion-item>
      <ion-reorder slot="start"></ion-reorder>
      <ion-label>
        Item 3
      </ion-label>
    </ion-item>

    <ion-item>
      <ion-reorder slot="start"></ion-reorder>
      <ion-label>
        Item 4
      </ion-label>
    </ion-item>

    <!-- Custom reorder icon end items -->
    <ion-item>
      <ion-label>
        Item 5
      </ion-label>
      <ion-reorder slot="end">
        <ion-icon name="pizza"></ion-icon>
      </ion-reorder>
    </ion-item>

    <ion-item>
      <ion-label>
        Item 6
      </ion-label>
      <ion-reorder slot="end">
        <ion-icon name="pizza"></ion-icon>
      </ion-reorder>
    </ion-item>

    <!-- Items wrapped in a reorder, entire item can be dragged -->
    <ion-reorder>
      <ion-item>
        <ion-label>
          Item 7
        </ion-label>
      </ion-item>
    </ion-reorder>

    <ion-reorder>
      <ion-item>
        <ion-label>
          Item 8
        </ion-label>
      </ion-item>
    </ion-reorder>
  </ion-reorder-group>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {

    doReorder(event) {
      // The `from` and `to` properties contain the index of the item
      // when the drag started and ended, respectively
      console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

      // Finish the reorder and position the item in the DOM based on
      // where the gesture ended. This method can also be called directly
      // by the reorder group
      event.detail.complete();
    }
  }
</script>
```



## Properties

| Property   | Attribute  | Description                            | Type      | Default |
| ---------- | ---------- | -------------------------------------- | --------- | ------- |
| `disabled` | `disabled` | If `true`, the reorder will be hidden. | `boolean` | `true`  |


## Events

| Event            | Description                                                                                                                                                                                           | Type                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `ionItemReorder` | Event that needs to be listened to in order to complete the reorder action. Once the event has been emitted, the `complete()` method then needs to be called in order to finalize the reorder action. | `CustomEvent<ItemReorderEventDetail>` |


## Methods

### `complete(listOrReorder?: boolean | any[] | undefined) => Promise<any>`

Completes the reorder operation. Must be called by the `ionItemReorder` event.

If a list of items is passed, the list will be reordered and returned in the
proper order.

If no parameters are passed or if `true` is passed in, the reorder will complete
and the item will remain in the position it was dragged to. If `false` is passed,
the reorder will complete and the item will bounce back to its original position.

#### Parameters

| Name            | Type                            | Description                                                                                                                       |
| --------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `listOrReorder` | `any[] \| boolean \| undefined` | A list of items to be sorted and returned in the new order or a boolean of whether or not the reorder should reposition the item. |

#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
