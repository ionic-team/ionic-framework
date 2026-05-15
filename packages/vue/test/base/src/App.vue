<template>
  <ion-app>
    <ion-router-outlet />
    <mode-switcher />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { defineComponent, inject } from 'vue';
import ModeSwitcher from './components/ModeSwitcher.vue';

export default defineComponent({
  components: {
    IonApp,
    IonRouterOutlet,
    ModeSwitcher
  },
  setup() {
    (window as any).debugIonRouter = useIonRouter();
    (window as any).debugIonNavManager = inject('navManager');
  }
});
</script>
