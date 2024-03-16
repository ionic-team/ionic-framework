<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-button @click="dismiss" id="dismiss">Dismiss</ion-button>
        </ion-buttons>
        <ion-title>Modal</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-label id="title">{{ title }}</ion-label>
      <ion-input :aria-label="title"></ion-input>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  modalController
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: { type: String, default: 'Default Title' }
  },
  components: {
    IonPage,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonInput
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
