```html
<template>
  <!-- Default backdrop -->
  <ion-backdrop></ion-backdrop>

  <!-- Backdrop that is not tappable -->
  <ion-backdrop tappable="false"></ion-backdrop>

  <!-- Backdrop that is not visible -->
  <ion-backdrop visible="false"></ion-backdrop>

  <!-- Backdrop with propagation -->
  <ion-backdrop stop-propagation="false"></ion-backdrop>

  <!-- Backdrop that sets dynamic properties -->
  <ion-backdrop
    :tappable="enableBackdropDismiss"
    :visible="showBackdrop"
    :stop-propagation="shouldPropagate">
  </ion-backdrop>
</template>

<script>
import { IonBackdrop } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonBackdrop },
  setup() {
    return {
      enableBackdropDismiss: true,
      showBackdrop: true,
      shouldPropagate: true
    }
  }
});
</script>
```