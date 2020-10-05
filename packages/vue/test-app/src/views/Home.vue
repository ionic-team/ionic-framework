<template>
  <ion-page data-pageid="home">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Test App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Test App</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item router-link="/overlays">
          <ion-label>Overlays</ion-label>
        </ion-item>
        <ion-item router-link="/inputs">
          <ion-label>Inputs</ion-label>
        </ion-item>
        <ion-item router-link="/slides">
          <ion-label>Slides</ion-label>
        </ion-item>
        <ion-item router-link="/navigation" id="navigation">
          <ion-label>Navigation</ion-label>
        </ion-item>
        <ion-item router-link="/nested" id="nested">
          <ion-label>Nested Router Outlet</ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar
  }
});
</script>
