<template>
  <ion-page data-pageid="tab2">
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item button router-link="/routing" id="routing">
        <ion-label>Go to /routing</ion-label>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
  import {
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  } from '@ionic/vue';

  export default {
    components: {
      IonButtons,
      IonBackButton,
      IonItem,
      IonLabel,
      IonPage,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent
    }
  }
</script>
