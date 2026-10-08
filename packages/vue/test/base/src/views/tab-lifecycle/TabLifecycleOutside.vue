<template>
  <ion-page data-pageid="tab-lifecycle-outside">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tab-lifecycle/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Outside Tabs</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <p>Outside the tabs</p>
      <ion-button id="go-to-settings" router-link="/tab-lifecycle/settings">Go to Settings Tab</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },
});
</script>
