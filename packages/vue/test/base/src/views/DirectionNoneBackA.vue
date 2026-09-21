<template>
  <ion-page data-pageid="direction-none-page-a">
    <ion-header>
      <ion-toolbar>
        <ion-title>Page A</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-forward" router-link="/direction-none-back/b">
        Go to B (forward)
      </ion-button>
      <ion-button id="go-none" router-link="/direction-none-back/b" router-direction="none">
        Go to B (none)
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
  }
});
</script>
