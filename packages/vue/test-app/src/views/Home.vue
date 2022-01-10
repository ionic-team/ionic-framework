<template>
  <ion-page data-pageid="home">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
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
        <ion-item button router-link="/overlays">
          <ion-label>Overlays</ion-label>
        </ion-item>
        <ion-item button router-link="/inputs">
          <ion-label>Inputs</ion-label>
        </ion-item>
        <ion-item button router-link="/slides">
          <ion-label>Slides</ion-label>
        </ion-item>
        <ion-item button router-link="/navigation" id="navigation">
          <ion-label>Navigation</ion-label>
        </ion-item>
        <ion-item button router-link="/routing" id="routing">
          <ion-label>Routing</ion-label>
        </ion-item>
        <ion-item button router-link="/default-href" id="default-href">
          <ion-label>Default Href</ion-label>
        </ion-item>
        <ion-item button router-link="/nested" id="nested">
          <ion-label>Nested Router Outlet</ion-label>
        </ion-item>
        <ion-item button router-link="/tabs" id="tabs">
          <ion-label>Tabs</ion-label>
        </ion-item>
        <ion-item button router-link="/tabs-new" id="tabs-news">
          <ion-label>Tabs New</ion-label>
        </ion-item>
        <ion-item button router-link="/tabs-secondary" id="tab-secondary">
          <ion-label>Tabs Secondary</ion-label>
        </ion-item>
        <ion-item button router-link="/lifecycle" id="lifecycle">
          <ion-label>Lifecycle</ion-label>
        </ion-item>
        <ion-item button router-link="/lifecycle-setup" id="lifecycle-setup">
          <ion-label>Lifecycle (Setup)</ion-label>
        </ion-item>
        <ion-item button router-link="/delayed-redirect" id="delayed-redirect">
          <ion-label>Delayed Redirect</ion-label>
        </ion-item>
        <ion-item  button router-link="/tabs/tab2" id="tabs-tab2">
          <ion-label>Go to /tabs/tab2</ion-label>
        </ion-item>
        <ion-item  @click="$router.go(2)" id="home-go-forward-2">
          <ion-label>$router.go(2)</ion-label>
        </ion-item>
        <ion-item  @click="$router.replace({path: '/routing' })" id="home-replace-routing">
          <ion-label>$router.replace({path: '/routing' })</ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonButtons, IonBackButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonButtons,
    IonBackButton,
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
