<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    (window as any).debugIonRouter = useIonRouter();
  }
});
</script>
