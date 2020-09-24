<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-button @click="dismiss">Dismiss</ion-button>
      </ion-buttons>
      <ion-title>Modal</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    Modal Content
  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  modalController
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ModalContent',
  components: {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  },
  setup() {
    const dismiss = async () => {
      await modalController.dismiss();
    }

    return {
      dismiss
    }
  }
})
</script>
