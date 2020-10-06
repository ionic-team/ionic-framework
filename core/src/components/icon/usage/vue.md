```html
<template>
  <!-- uses "star" icon for both modes -->
  <ion-icon :icon="star"></ion-icon>

  <!-- explicitly set the icon for each mode -->
  <ion-icon :ios="home" :md="star"></ion-icon>

  <!-- use a custom svg icon -->
  <ion-icon src="/path/to/external/file.svg"></ion-icon>

  <!-- set the icon size -->
  <ion-icon size="small" :icon="heart"></ion-icon>
  <ion-icon size="large" :icon="heart"></ion-icon>
</template>

<script>
import { IonIcon } from '@ionic/vue';
import { heart, home, star } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonIcon },
  setup() {
    return { heart, home, star }
  }
});
</script>
```
