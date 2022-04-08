# ion-item-sliding

A sliding item contains an item that can be dragged to reveal buttons. It requires an [item](../item) component as a child. All options to reveal should be placed in the [item options](../item-options) element.


## Swipe Direction

By default, the buttons are placed on the `"end"` side. This means that options are revealed when the sliding item is swiped from end to start, i.e. from right to left in LTR, but from left to right in RTL. To place them on the opposite side, so that they are revealed when swiping in the opposite direction, set the `side` attribute to `"start"` on the [`ion-item-options`](../item-options) element. Up to two `ion-item-options` can be used at the same time in order to reveal two different sets of options depending on the swiping direction.


## Options Layout

By default if an icon is placed with text in the [item option](../item-option), it will display the icon on top of the text, but the icon slot can be changed to any of the following to position it in the option.

| Slot        | Description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| `start`     | In LTR, start is the left side of the button, and in RTL it is the right |
| `top`       | The icon is above the text                                               |
| `icon-only` | The icon is the only content of the button                               |
| `bottom`    | The icon is below the text                                               |
| `end`       | In LTR, end is the right side of the button, and in RTL it is the left   |


## Expandable Options

Options can be expanded to take up the full width of the item if you swipe past a certain point. This can be combined with the `ionSwipe` event to call methods on the class.

## Interfaces

### ItemSlidingCustomEvent

While not required, this interface can be used in place of the `CustomEvent` interface for stronger typing with Ionic events emitted from this component.

```typescript
interface ItemSlidingCustomEvent extends CustomEvent {
  target: HTMLIonItemSlidingElement;
}
```


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-list>
  <!-- Sliding item with text options on both sides -->
  <ion-item-sliding>
    <ion-item-options side="start">
      <ion-item-option (click)="favorite(item)">Favorite</ion-item-option>
      <ion-item-option color="danger" (click)="share(item)">Share</ion-item-option>
    </ion-item-options>

    <ion-item>
      <ion-label>Item Options</ion-label>
    </ion-item>

    <ion-item-options side="end">
      <ion-item-option (click)="unread(item)">Unread</ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with expandable options on both sides -->
  <ion-item-sliding>
    <ion-item-options side="start">
      <ion-item-option color="danger" expandable>
        Delete
      </ion-item-option>
    </ion-item-options>

    <ion-item>
      <ion-label>Expandable Options</ion-label>
    </ion-item>

    <ion-item-options side="end">
      <ion-item-option color="tertiary" expandable>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Multi-line sliding item with icon options on both sides -->
  <ion-item-sliding id="item100">
    <ion-item href="#">
      <ion-label>
        <h2>HubStruck Notifications</h2>
        <p>A new message in your network</p>
        <p>Oceanic Next has joined your network</p>
      </ion-label>
      <ion-note slot="end">
        10:45 AM
      </ion-note>
    </ion-item>

    <ion-item-options side="start">
      <ion-item-option>
        <ion-icon slot="icon-only" name="heart"></ion-icon>
      </ion-item-option>
    </ion-item-options>

    <ion-item-options side="end">
      <ion-item-option color="danger">
        <ion-icon slot="icon-only" name="trash"></ion-icon>
      </ion-item-option>
      <ion-item-option>
        <ion-icon slot="icon-only" name="star"></ion-icon>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with icon start options on end side -->
  <ion-item-sliding>
    <ion-item>
      <ion-label>
        Sliding Item, Icons Start
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option color="primary">
        <ion-icon slot="start" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
        More
      </ion-item-option>
      <ion-item-option color="secondary">
        <ion-icon slot="start" name="archive"></ion-icon>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with icon end options on end side -->
  <ion-item-sliding>
    <ion-item>
      <ion-label>
        Sliding Item, Icons End
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option color="primary">
        <ion-icon slot="end" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
        More
      </ion-item-option>
      <ion-item-option color="secondary">
        <ion-icon slot="end" name="archive"></ion-icon>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with icon top options on end side -->
  <ion-item-sliding>
    <ion-item>
      <ion-label>
        Sliding Item, Icons Top
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option color="primary">
        <ion-icon slot="top" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
        More
      </ion-item-option>
      <ion-item-option color="secondary">
        <ion-icon slot="top" name="archive"></ion-icon>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with icon bottom options on end side -->
  <ion-item-sliding>
    <ion-item>
      <ion-label>
        Sliding Item, Icons Bottom
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option color="primary">
        <ion-icon slot="bottom" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
        More
      </ion-item-option>
      <ion-item-option color="secondary">
        <ion-icon slot="bottom" name="archive"></ion-icon>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</ion-list>
```


### Javascript

```html
<ion-list>
  <!-- Sliding item with text options on both sides -->
  <ion-item-sliding>
    <ion-item-options side="start">
      <ion-item-option onClick="favorite(item)">Favorite</ion-item-option>
      <ion-item-option color="danger" onClick="share(item)">Share</ion-item-option>
    </ion-item-options>

    <ion-item>
      <ion-label>Item Options</ion-label>
    </ion-item>

    <ion-item-options side="end">
      <ion-item-option onClick="unread(item)">Unread</ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with expandable options on both sides -->
  <ion-item-sliding>
    <ion-item-options side="start">
      <ion-item-option color="danger" expandable>
        Delete
      </ion-item-option>
    </ion-item-options>

    <ion-item>
      <ion-label>Expandable Options</ion-label>
    </ion-item>

    <ion-item-options side="end">
      <ion-item-option color="tertiary" expandable>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Multi-line sliding item with icon options on both sides -->
  <ion-item-sliding id="item100">
    <ion-item href="#">
      <ion-label>
        <h2>HubStruck Notifications</h2>
        <p>A new message in your network</p>
        <p>Oceanic Next has joined your network</p>
      </ion-label>
      <ion-note slot="end">
        10:45 AM
      </ion-note>
    </ion-item>

    <ion-item-options side="start">
      <ion-item-option>
        <ion-icon slot="icon-only" name="heart"></ion-icon>
      </ion-item-option>
    </ion-item-options>

    <ion-item-options side="end">
      <ion-item-option color="danger">
        <ion-icon slot="icon-only" name="trash"></ion-icon>
      </ion-item-option>
      <ion-item-option>
        <ion-icon slot="icon-only" name="star"></ion-icon>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with icon start options on end side -->
  <ion-item-sliding>
    <ion-item>
      <ion-label>
        Sliding Item, Icons Start
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option color="primary">
        <ion-icon slot="start" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
        More
      </ion-item-option>
      <ion-item-option color="secondary">
        <ion-icon slot="start" name="archive"></ion-icon>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with icon end options on end side -->
  <ion-item-sliding>
    <ion-item>
      <ion-label>
        Sliding Item, Icons End
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option color="primary">
        <ion-icon slot="end" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
        More
      </ion-item-option>
      <ion-item-option color="secondary">
        <ion-icon slot="end" name="archive"></ion-icon>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with icon top options on end side -->
  <ion-item-sliding>
    <ion-item>
      <ion-label>
        Sliding Item, Icons Top
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option color="primary">
        <ion-icon slot="top" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
        More
      </ion-item-option>
      <ion-item-option color="secondary">
        <ion-icon slot="top" name="archive"></ion-icon>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <!-- Sliding item with icon bottom options on end side -->
  <ion-item-sliding>
    <ion-item>
      <ion-label>
        Sliding Item, Icons Bottom
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option color="primary">
        <ion-icon slot="bottom" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
        More
      </ion-item-option>
      <ion-item-option color="secondary">
        <ion-icon slot="bottom" name="archive"></ion-icon>
        Archive
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</ion-list>
```


### React

```tsx
import React from 'react';
import { IonList, IonItemSliding, IonItem, IonLabel, IonItemOptions, IonItemOption, IonIcon, IonNote } from '@ionic/react';

import { heart, trash, star, archive, ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';

export const ItemSlidingExample: React.FC = () => (
<IonList>
  {/* Sliding item with text options on both sides */}
  <IonItemSliding>
    <IonItemOptions side="start">
      <IonItemOption onClick={() => console.log('favorite clicked')}>Favorite</IonItemOption>
      <IonItemOption color="danger" onClick={() => console.log('share clicked')}>Share</IonItemOption>
    </IonItemOptions>

    <IonItem>
      <IonLabel>Item Options</IonLabel>
    </IonItem>

    <IonItemOptions side="end">
      <IonItemOption onClick={() => console.log('unread clicked')}>Unread</IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with expandable options on both sides */}
  <IonItemSliding>
    <IonItemOptions side="start">
      <IonItemOption color="danger" expandable>
        Delete
      </IonItemOption>
    </IonItemOptions>

    <IonItem>
      <IonLabel>Expandable Options</IonLabel>
    </IonItem>

    <IonItemOptions side="end">
      <IonItemOption color="tertiary" expandable>
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Multi-line sliding item with icon options on both sides */}
  <IonItemSliding id="item100">
    <IonItem href="#">
      <IonLabel>
        <h2>HubStruck Notifications</h2>
        <p>A new message in your network</p>
        <p>Oceanic Next has joined your network</p>
      </IonLabel>
      <IonNote slot="end">
        10:45 AM
      </IonNote>
    </IonItem>

    <IonItemOptions side="start">
      <IonItemOption>
        <IonIcon slot="icon-only" icon={heart} />
      </IonItemOption>
    </IonItemOptions>

    <IonItemOptions side="end">
      <IonItemOption color="danger">
        <IonIcon slot="icon-only" icon={trash} />
      </IonItemOption>
      <IonItemOption>
        <IonIcon slot="icon-only" icon={star} />
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with icon start options on end side */}
  <IonItemSliding>
    <IonItem>
      <IonLabel>
        Sliding Item, Icons Start
      </IonLabel>
    </IonItem>
    <IonItemOptions>
      <IonItemOption color="primary">
        <IonIcon slot="start" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
        More
      </IonItemOption>
      <IonItemOption color="secondary">
        <IonIcon slot="start" icon={archive} />
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with icon end options on end side */}
  <IonItemSliding>
    <IonItem>
      <IonLabel>
        Sliding Item, Icons End
      </IonLabel>
    </IonItem>
    <IonItemOptions>
      <IonItemOption color="primary">
        <IonIcon slot="end" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
        More
      </IonItemOption>
      <IonItemOption color="secondary">
        <IonIcon slot="end" icon={archive} />
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with icon top options on end side */}
  <IonItemSliding>
    <IonItem>
      <IonLabel>
        Sliding Item, Icons Top
      </IonLabel>
    </IonItem>
    <IonItemOptions>
      <IonItemOption color="primary">
        <IonIcon slot="top" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
        More
      </IonItemOption>
      <IonItemOption color="secondary">
        <IonIcon slot="top" icon={archive} />
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>

  {/* Sliding item with icon bottom options on end side */}
  <IonItemSliding>
    <IonItem>
      <IonLabel>
        Sliding Item, Icons Bottom
      </IonLabel>
    </IonItem>
    <IonItemOptions>
      <IonItemOption color="primary">
        <IonIcon slot="bottom" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
        More
      </IonItemOption>
      <IonItemOption color="secondary">
        <IonIcon slot="bottom" icon={archive} />
        Archive
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>
</IonList>
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'item-sliding-example',
  styleUrl: 'item-sliding-example.css'
})
export class ItemSlidingExample {
  favorite(ev: any) {
    console.log('Favorite clicked', ev);
  }

  share(ev: any) {
    console.log('Favorite clicked', ev);
  }

  unread(ev: any) {
    console.log('Favorite clicked', ev);
  }

  render() {
    return [
      <ion-list>
        {/* Sliding item with text options on both sides */}
        <ion-item-sliding>
          <ion-item-options side="start">
            <ion-item-option onClick={(ev) => this.favorite(ev)}>Favorite</ion-item-option>
            <ion-item-option color="danger" onClick={(ev) => this.share(ev)}>Share</ion-item-option>
          </ion-item-options>

          <ion-item>
            <ion-label>Item Options</ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option onClick={(ev) => this.unread(ev)}>Unread</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        {/* Sliding item with expandable options on both sides */}
        <ion-item-sliding>
          <ion-item-options side="start">
            <ion-item-option color="danger" expandable>
              Delete
            </ion-item-option>
          </ion-item-options>

          <ion-item>
            <ion-label>Expandable Options</ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="tertiary" expandable>
              Archive
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        {/* Multi-line sliding item with icon options on both sides */}
        <ion-item-sliding id="item100">
          <ion-item href="#">
            <ion-label>
              <h2>HubStruck Notifications</h2>
              <p>A new message in your network</p>
              <p>Oceanic Next has joined your network</p>
            </ion-label>
            <ion-note slot="end">
              10:45 AM
            </ion-note>
          </ion-item>

          <ion-item-options side="start">
            <ion-item-option>
              <ion-icon slot="icon-only" name="heart"></ion-icon>
            </ion-item-option>
          </ion-item-options>

          <ion-item-options side="end">
            <ion-item-option color="danger">
              <ion-icon slot="icon-only" name="trash"></ion-icon>
            </ion-item-option>
            <ion-item-option>
              <ion-icon slot="icon-only" name="star"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        {/* Sliding item with icon start options on end side */}
        <ion-item-sliding>
          <ion-item>
            <ion-label>
              Sliding Item, Icons Start
            </ion-label>
          </ion-item>
          <ion-item-options>
            <ion-item-option color="primary">
              <ion-icon slot="start" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
              More
            </ion-item-option>
            <ion-item-option color="secondary">
              <ion-icon slot="start" name="archive"></ion-icon>
              Archive
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        {/* Sliding item with icon end options on end side */}
        <ion-item-sliding>
          <ion-item>
            <ion-label>
              Sliding Item, Icons End
            </ion-label>
          </ion-item>
          <ion-item-options>
            <ion-item-option color="primary">
              <ion-icon slot="end" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
              More
            </ion-item-option>
            <ion-item-option color="secondary">
              <ion-icon slot="end" name="archive"></ion-icon>
              Archive
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        {/* Sliding item with icon top options on end side */}
        <ion-item-sliding>
          <ion-item>
            <ion-label>
              Sliding Item, Icons Top
            </ion-label>
          </ion-item>
          <ion-item-options>
            <ion-item-option color="primary">
              <ion-icon slot="top" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
              More
            </ion-item-option>
            <ion-item-option color="secondary">
              <ion-icon slot="top" name="archive"></ion-icon>
              Archive
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>

        {/* Sliding item with icon bottom options on end side */}
        <ion-item-sliding>
          <ion-item>
            <ion-label>
              Sliding Item, Icons Bottom
            </ion-label>
          </ion-item>
          <ion-item-options>
            <ion-item-option color="primary">
              <ion-icon slot="bottom" ios="ellipsis-horizontal" md="ellipsis-vertical"></ion-icon>
              More
            </ion-item-option>
            <ion-item-option color="secondary">
              <ion-icon slot="bottom" name="archive"></ion-icon>
              Archive
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    ];
  }
}
```


### Vue

```html
<template>
  <ion-list>
    <!-- Sliding item with text options on both sides -->
    <ion-item-sliding>
      <ion-item-options side="start">
        <ion-item-option @click="favorite(item)">Favorite</ion-item-option>
        <ion-item-option color="danger" @click="share(item)">Share</ion-item-option>
      </ion-item-options>

      <ion-item>
        <ion-label>Item Options</ion-label>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option @click="unread(item)">Unread</ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <!-- Sliding item with expandable options on both sides -->
    <ion-item-sliding>
      <ion-item-options side="start">
        <ion-item-option color="danger" expandable>
          Delete
        </ion-item-option>
      </ion-item-options>

      <ion-item>
        <ion-label>Expandable Options</ion-label>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option color="tertiary" expandable>
          Archive
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <!-- Multi-line sliding item with icon options on both sides -->
    <ion-item-sliding id="item100">
      <ion-item href="#">
        <ion-label>
          <h2>HubStruck Notifications</h2>
          <p>A new message in your network</p>
          <p>Oceanic Next has joined your network</p>
        </ion-label>
        <ion-note slot="end">
          10:45 AM
        </ion-note>
      </ion-item>

      <ion-item-options side="start">
        <ion-item-option>
          <ion-icon slot="icon-only" :icon="heart"></ion-icon>
        </ion-item-option>
      </ion-item-options>

      <ion-item-options side="end">
        <ion-item-option color="danger">
          <ion-icon slot="icon-only" :icon="trash"></ion-icon>
        </ion-item-option>
        <ion-item-option>
          <ion-icon slot="icon-only" :icon="star"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <!-- Sliding item with icon start options on end side -->
    <ion-item-sliding>
      <ion-item>
        <ion-label>
          Sliding Item, Icons Start
        </ion-label>
      </ion-item>
      <ion-item-options>
        <ion-item-option color="primary">
          <ion-icon slot="start" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          More
        </ion-item-option>
        <ion-item-option color="secondary">
          <ion-icon slot="start" :icon="archive"></ion-icon>
          Archive
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <!-- Sliding item with icon end options on end side -->
    <ion-item-sliding>
      <ion-item>
        <ion-label>
          Sliding Item, Icons End
        </ion-label>
      </ion-item>
      <ion-item-options>
        <ion-item-option color="primary">
          <ion-icon slot="end" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          More
        </ion-item-option>
        <ion-item-option color="secondary">
          <ion-icon slot="end" :icon="archive"></ion-icon>
          Archive
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <!-- Sliding item with icon top options on end side -->
    <ion-item-sliding>
      <ion-item>
        <ion-label>
          Sliding Item, Icons Top
        </ion-label>
      </ion-item>
      <ion-item-options>
        <ion-item-option color="primary">
          <ion-icon slot="top" :ios="ellipsis-horizontal" :md="ellipsis-vertical"></ion-icon>
          More
        </ion-item-option>
        <ion-item-option color="secondary">
          <ion-icon slot="top" :icon="archive"></ion-icon>
          Archive
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>

    <!-- Sliding item with icon bottom options on end side -->
    <ion-item-sliding>
      <ion-item>
        <ion-label>
          Sliding Item, Icons Bottom
        </ion-label>
      </ion-item>
      <ion-item-options>
        <ion-item-option color="primary">
          <ion-icon slot="bottom" :ios="ellipsisHorizontal" :md="ellipsisVertical"></ion-icon>
          More
        </ion-item-option>
        <ion-item-option color="secondary">
          <ion-icon slot="bottom" :icon="archive"></ion-icon>
          Archive
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  </ion-list>
</template>

<script>
import { 
  IonIcon, 
  IonItem, 
  IonItemOption, 
  IonItemOptions, 
  IonItemSliding, 
  IonLabel, 
  IonList
} from '@ionic/vue';
import { 
  archive, 
  ellipsisHorizontal, 
  ellipsisVertical,
  heart, 
  star, 
  trash
} from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { 
    IonIcon, 
    IonItem, 
    IonItemOption, 
    IonItemOptions, 
    IonItemSliding, 
    IonLabel, 
    IonList
  },
  setup() {
    return {
      archive, 
      ellipsisHorizontal, 
      ellipsisVertical,
      heart, 
      star, 
      trash
    }
  }
});
</script>
```



## Properties

| Property   | Attribute  | Description                                                | Type      | Default |
| ---------- | ---------- | ---------------------------------------------------------- | --------- | ------- |
| `disabled` | `disabled` | If `true`, the user cannot interact with the sliding item. | `boolean` | `false` |


## Events

| Event     | Description                                | Type               |
| --------- | ------------------------------------------ | ------------------ |
| `ionDrag` | Emitted when the sliding position changes. | `CustomEvent<any>` |


## Methods

### `close() => Promise<void>`

Close the sliding item. Items can also be closed from the [List](./list).

#### Returns

Type: `Promise<void>`



### `closeOpened() => Promise<boolean>`

Close all of the sliding items in the list. Items can also be closed from the [List](./list).

#### Returns

Type: `Promise<boolean>`



### `getOpenAmount() => Promise<number>`

Get the amount the item is open in pixels.

#### Returns

Type: `Promise<number>`



### `getSlidingRatio() => Promise<number>`

Get the ratio of the open amount of the item compared to the width of the options.
If the number returned is positive, then the options on the right side are open.
If the number returned is negative, then the options on the left side are open.
If the absolute value of the number is greater than 1, the item is open more than
the width of the options.

#### Returns

Type: `Promise<number>`



### `open(side: Side | undefined) => Promise<void>`

Open the sliding item.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
