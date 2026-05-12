<template>
  <ion-page data-pageid="direction-none-page-b">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/direction-none-back/fallback"></ion-back-button>
        </ion-buttons>
        <ion-title>Page B</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p>Page B content</p>
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
