<template>
  <ion-page data-pageid="swipe-gesture-disabled-details">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/swipe-gesture-disabled"></ion-back-button>
        </ion-buttons>
        <ion-title>Swipe Disabled Details</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div>Details (swipe disabled)</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  }
});
</script>
