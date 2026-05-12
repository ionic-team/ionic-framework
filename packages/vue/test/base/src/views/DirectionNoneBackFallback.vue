<template>
  <ion-page data-pageid="direction-none-page-fallback">
    <ion-header>
      <ion-toolbar>
        <ion-title>Fallback (defaultHref)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p>This page should NOT be reached via back button if history exists</p>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  }
});
</script>
