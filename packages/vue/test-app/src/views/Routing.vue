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

      <ion-item button router-link="/routing/abc" id="parameter-abc">
        <ion-label>Go to Parameter Page ABC</ion-label>
      </ion-item>

      <ion-item button router-link="/routing/xyz" id="parameter-xyz">
        <ion-label>Go to Parameter Page XYZ</ion-label>
      </ion-item>

      <ion-item button router-link="/routing/123/view" id="parameter-view-item">
        <ion-label>Go to Parameterized Page View</ion-label>
      </ion-item>

      <ion-item button @click="replace" id="replace">
        <ion-label>Replace to Navigation page</ion-label>
      </ion-item>

      <ion-item button router-link="/tabs/tab1" id="tab1">
        <ion-label>Go to /tabs/tab1</ion-label>
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

    const replace = () => {
      router.replace('/navigation');
    }

    return { setRouteParams, replace }
  }
});
</script>
