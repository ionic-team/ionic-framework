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

<script>
import { 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonReorder, 
  IonReorderGroup
} from '@ionic/vue';
import { pizza } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { 
    IonIcon, 
    IonItem, 
    IonLabel, 
    IonReorder, 
    IonReorderGroup
  },
  setup() {
    const doReorder = (event: CustomEvent) => {
      // The `from` and `to` properties contain the index of the item
      // when the drag started and ended, respectively
      console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

      // Finish the reorder and position the item in the DOM based on
      // where the gesture ended. This method can also be called directly
      // by the reorder group
      event.detail.complete();
    }
    return { doReorder, pizza }
  }
});
</script>
```

### Updating Data

```html
<script>
...
import { defineComponent, ref } from 'vue';

export default defineComponent({
  ...
  setup() {
    const items = ref([1, 2, 3, 4, 5]);

    const doReorder = (event: CustomEvent) => {
      // Before complete is called with the items they will remain in the
      // order before the drag
      console.log('Before complete', this.items);

      // Finish the reorder and position the item in the DOM based on
      // where the gesture ended. Update the items variable to the
      // new order of items
      items.value = event.detail.complete(items.value);

      // After complete is called the items will be in the new order
      console.log('After complete', this.items);
    }
    return { doReorder, items, ... }
  }
});
</script>
```
