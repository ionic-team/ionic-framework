<template>
  <ion-page data-pageid="swipe-gesture-disabled-outlet">
    <ion-router-outlet :swipe-gesture="false"></ion-router-outlet>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonPage,
    IonRouterOutlet
  }
});
</script>
