<template>
  <ion-page data-pageid="lifecycle-error">
    <p>The page transition should complete after the error is captured.</p>
    <ion-button router-link="/">Go home</ion-button>
  </ion-page>
</template>

<script lang="ts">
import { IonButton, IonPage, onIonViewWillEnter } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: { IonButton, IonPage },
  ionViewWillEnter() {
    if (this.route.query.api === 'options') {
      return this.fail();
    }
  },
  setup() {
    const route = useRoute();
    const fail = () => {
      const error = new Error('Ionic lifecycle error');
      if (route.query.async === 'true') {
        return Promise.reject(error);
      }
      throw error;
    };
    onIonViewWillEnter(() => {
      if (route.query.api !== 'options') {
        return fail();
      }
    });
    return { route, fail };
  },
});
</script>
