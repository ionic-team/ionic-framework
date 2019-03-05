# ion-reorder-group

The reorder group is a wrapper component for items with the `ion-reorder` component, Check [Reorder documentation](../reorder/) for further information about the anchor component that is used to drag items within the `ion-reorder-group` list.

Once the user drags an item and drops it in a new position, the `ionItemReorder` event is dispatched. A handler for it must be implemented by the developer to commit changes.

```js
reorderGroup.addEventListener('ionItemReorder', (ev) => {
  console.log(`Moving item from ${ev.detail.from} to ${ev.detail.to}`);

  this.dataList = reorderArray(this.dataList, ev.detail.from, ev.detail.to);
  ev.detail.complete();
});
```

The event's detail includes all the relevant information about the reorder operation, including the `from` and `to` indexes. In the context of reordering, an item moves `from` index X `to` index Y.

For example, in this list we move the item at index `0` to the index `3`:

```
BEFORE | AFTER
  0    |   1
  1    |   2
  2    |   3
  3    |   0
  4    |   4
```

```
detail: {
  from: 0
  to: 3
}
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
<ion-content>
  <ion-list>
    <ion-reorder-group>

      <ion-item>
        <ion-label>
          Item 1
        </ion-label>
        <ion-reorder slot="end"></ion-reorder>
      </ion-item>

      <ion-item>
        <ion-label>
          Item 2 (default ion-reorder slot="start")
        </ion-label>
        <ion-reorder slot="start"></ion-reorder>
      </ion-item>

      <ion-item>
        <ion-label>
          Item 3 (custom ion-reorder)
        </ion-label>
        <ion-reorder slot="end">
          <ion-icon name="pizza"></ion-icon>
        </ion-reorder>
      </ion-item>

      <ion-item>
        <ion-label>
          Item 4 (custom ion-reorder slot="start")
        </ion-label>
        <ion-reorder slot="start">
          <ion-icon name="pizza"></ion-icon>
        </ion-reorder>
      </ion-item>

      <ion-reorder>
        <ion-item>
          <ion-label>
            Item 5 (the whole item can be dragged)
          </ion-label>
          </ion-item>
      </ion-reorder>

    </ion-reorder-group>
  </ion-list>
</ion-content>
```


### Javascript

```html
<ion-content>
  <ion-list>
    <ion-reorder-group disabled="false">

      <ion-item>
        <ion-label>
          Item 1
        </ion-label>
        <ion-reorder slot="end"></ion-reorder>
      </ion-item>

      <ion-item>
        <ion-label>
          Item 2 (default ion-reorder slot="start")
        </ion-label>
        <ion-reorder slot="start"></ion-reorder>
      </ion-item>

      <ion-item>
        <ion-label>
          Item 3 (custom ion-reorder)
        </ion-label>
        <ion-reorder slot="end">
          <ion-icon name="pizza"></ion-icon>
        </ion-reorder>
      </ion-item>

      <ion-item>
        <ion-label>
          Item 4 (custom ion-reorder slot="start")
        </ion-label>
        <ion-reorder slot="start">
          <ion-icon name="pizza"></ion-icon>
        </ion-reorder>
      </ion-item>

      <ion-reorder>
        <ion-item>
          <ion-label>
            Item 5 (the whole item can be dragged)
          </ion-label>
          </ion-item>
      </ion-reorder>

    </ion-reorder-group>
  </ion-list>
</ion-content>
```

```javascript
const reorderGroup = document.querySelector('ion-reorder-group');
reorderGroup.addEventListener('ionItemReorder', ({detail}) => {
  // finishing the reorder, true means ion-reorder-group with reorder the DOM
  detail.complete(true);

  // or:
  // reorderGroup.complete(true)
});
```


### React

```tsx
import React from 'react';

import { IonContent, IonList, IonItem, IonLabel, IonReorder, IonReorderGroup, IonIcon } from '@ionic/react';

const Example: React.SFC<{}> = () => (

  <IonContent>
    <IonList>
      <IonReorderGroup>

        <IonItem>
          <IonLabel>
            Item 1
          </IonLabel>
          <IonReorder slot="end"></IonReorder>
        </IonItem>

        <IonItem>
          <IonLabel>
            Item 2 (default ion-reorder slot="start")
          </IonLabel>
          <IonReorder slot="start"></IonReorder>
        </IonItem>

        <IonItem>
          <IonLabel>
            Item 3 (custom ion-reorder)
          </IonLabel>
          <IonReorder slot="end">
            <IonIcon name="pizza" />
          </IonReorder>
        </IonItem>

        <IonItem>
          <IonLabel>
            Item 4 (custom ion-reorder slot="start")
          </IonLabel>
          <IonReorder slot="start">
            <IonIcon name="pizza" />
          </IonReorder>
        </IonItem>

        <IonReorder>
          <IonItem>
            <IonLabel>
              Item 5 (the whole item can be dragged)
            </IonLabel>
            </IonItem>
        </IonReorder>

      </IonReorderGroup>
    </IonList>
  </IonContent>
);

export default Example


### Vue

```html
<template>
  <ion-content>
    <ion-list>
      <ion-reorder-group>

        <ion-item>
          <ion-label>
            Item 1
          </ion-label>
          <ion-reorder slot="end"></ion-reorder>
        </ion-item>

        <ion-item>
          <ion-label>
            Item 2 (default ion-reorder slot="start")
          </ion-label>
          <ion-reorder slot="start"></ion-reorder>
        </ion-item>

        <ion-item>
          <ion-label>
            Item 3 (custom ion-reorder)
          </ion-label>
          <ion-reorder slot="end">
            <ion-icon name="pizza"></ion-icon>
          </ion-reorder>
        </ion-item>

        <ion-item>
          <ion-label>
            Item 4 (custom ion-reorder slot="start")
          </ion-label>
          <ion-reorder slot="start">
            <ion-icon name="pizza"></ion-icon>
          </ion-reorder>
        </ion-item>

        <ion-reorder>
          <ion-item>
            <ion-label>
              Item 5 (the whole item can be dragged)
            </ion-label>
            </ion-item>
        </ion-reorder>

      </ion-reorder-group>
    </ion-list>
  </ion-content>
</template>
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

This method must be called once the `ionItemReorder` event is handled in order
to complete the reorder operation.

#### Parameters

| Name            | Type                            | Description |
| --------------- | ------------------------------- | ----------- |
| `listOrReorder` | `any[] \| boolean \| undefined` |             |

#### Returns

Type: `Promise<any>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
