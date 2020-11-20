<template>
  <ion-page data-pageid="tab1childone">
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Tab 1 Child 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1 Child 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item router-link="child-two" id="child-two">
        <ion-label>Tab 1 Child 2</ion-label>
      </ion-item>

    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButtons,
  IonBackButton,
  IonPage,
  IonHeader,
  IonItem,
  IonLabel,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/vue';

export default  {
  components: {
    IonButtons,
    IonBackButton,
    IonPage,
    IonHeader,
    IonItem,
    IonLabel,
    IonToolbar,
    IonTitle,
    IonContent
  }
}
</script>
