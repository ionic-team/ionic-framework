```html
<template>
  <ion-list>
    <ion-item v-for="item in items" :key="item.src">
      <ion-thumbnail slot="start">
        <ion-img :src="item.src"></ion-img>
      </ion-thumbnail>
      <ion-label>{{item.text}}</ion-label>
    </ion-item>
  </ion-list>
</template>

<script>
import { IonImg, IonItem, IonLabel, IonList, IonThumbnail } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonImg, IonItem, IonLabel, IonList, IonThumbnail },
  setup() {
    const items = [{
      'text': 'Item 1',
      'src': '/path/to/external/file.png'
    }, {
      'text': 'Item 2',
      'src': '/path/to/external/file.png'
    }, {
      'text': 'Item 3',
      'src': '/path/to/external/file.png'
    }];
    return { items }
  }
});
</script>
```
