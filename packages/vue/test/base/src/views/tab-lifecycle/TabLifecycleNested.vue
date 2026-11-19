<template>
  <ion-page data-pageid="tab-lifecycle-nested">
    <ion-router-outlet></ion-router-outlet>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonPage, IonRouterOutlet },
});
</script>
