<template>
  <ion-page data-pageid="home3">
    <ion-header>
      <ion-toolbar>
        <ion-title>Home 3</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div data-testid="home3-content">Home 3 Content</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent },
});
</script>
