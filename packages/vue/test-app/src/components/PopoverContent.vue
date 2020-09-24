<template>
  <ion-content class="ion-padding">
    Popover Content
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
