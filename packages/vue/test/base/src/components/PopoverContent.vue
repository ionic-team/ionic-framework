<template>
  <ion-content class="ion-padding">
    <ion-button id="dismiss" @click="dismiss">Dismiss</ion-button> <br />

    <div id="title">
      {{ title }}
    </div>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  popoverController
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: { type: String, default: 'Default Title' }
  },
  components: {
    IonButton,
    IonContent
  },
  setup() {
    const dismiss = async () => {
      await popoverController.dismiss();
    }

    return {
      dismiss
    }
  }
})
</script>
