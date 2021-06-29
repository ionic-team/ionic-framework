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
