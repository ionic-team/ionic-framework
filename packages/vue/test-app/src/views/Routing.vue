<template>
  <ion-page data-pageid="routing">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Routing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Routing</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item button @click="setRouteParams" id="route-params">
        <ion-label>Set Route Parameters</ion-label>
      </ion-item>

      <ion-item button router-link="/routing/child" id="child">
        <ion-label>Go to Child Page</ion-label>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar
  },
  setup() {
    const router = useRouter();
    const setRouteParams = () => {
      router.push({
        query: {
          search: 'liamwashere'
        }
      });
    }

    return { setRouteParams }
  }
});
</script>
