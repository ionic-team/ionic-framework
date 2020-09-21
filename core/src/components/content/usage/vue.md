```html
<template>
  <ion-content
    :scroll-events="true"
    @ionScrollStart="logScrollStart()"
    @ionScroll="logScrolling($event)"
    @ionScrollEnd="logScrollEnd()">
      <h1>Main Content</h1>

      <div slot="fixed">
        <h1>Fixed Content</h1>
      </div>
  </ion-content>
</template>

<script>
import { IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonContent }
});
</script>

```

