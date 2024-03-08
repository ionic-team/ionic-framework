<template>
  <ion-page data-pageid="navigation">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Navigation</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Navigation</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <ion-button expand="block" @click="openModal" id="open-nav-modal">Open Modal</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController
} from '@ionic/vue';
import { defineComponent } from 'vue';
import Nav from '@/components/Nav.vue';
export default defineComponent({
  components: {
    IonButton,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  },
  setup() {
    const openModal = async () => {
      const modal = await modalController.create({
        component: Nav
      });

      await modal.present();
    }
    return { openModal }
  }
});
</script>
