<template>
  <ion-page>
    <ion-content>
      <ion-router-outlet></ion-router-outlet>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonRouterOutlet,
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RouterOutlet',
  components: {
    IonContent,
    IonPage,
    IonRouterOutlet
  }
});
</script>
