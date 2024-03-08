<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Breadcrumbs</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <h1>Default</h1>
      <ion-breadcrumbs id="default">
        <ion-breadcrumb href="#"> Home </ion-breadcrumb>
        <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
        <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
        <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
        <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
        <ion-breadcrumb> 35 mm </ion-breadcrumb>
      </ion-breadcrumbs>
      <hr />
      <h1>Color: Danger</h1>
      <ion-breadcrumbs id="color" color="danger">
        <ion-breadcrumb href="#"> Home </ion-breadcrumb>
        <ion-breadcrumb href="#electronics"> Electronics </ion-breadcrumb>
        <ion-breadcrumb href="#photography"> Photography </ion-breadcrumb>
        <ion-breadcrumb href="#cameras"> Cameras </ion-breadcrumb>
        <ion-breadcrumb href="#film"> Film </ion-breadcrumb>
        <ion-breadcrumb> 35 mm </ion-breadcrumb>
      </ion-breadcrumbs>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBreadcrumbs,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBreadcrumbs,
  },
});
</script>
