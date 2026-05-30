<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
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

<script setup lang="ts">
import {
  IonBackButton,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonPage,
} from "@ionic/vue";
</script>
