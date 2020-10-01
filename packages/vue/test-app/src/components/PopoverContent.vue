<template>
  <ion-content class="ion-padding">
    {{ title }}
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  popoverController
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PopoverContent',
  props: {
    title: { type: String, default: 'Default Title' }
  },
  components: {
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
