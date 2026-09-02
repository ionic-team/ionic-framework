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
        <ion-breadcrumb :href="homePath"> Home </ion-breadcrumb>
        <ion-breadcrumb :href="`${basePath}#electronics`"> Electronics </ion-breadcrumb>
        <ion-breadcrumb :href="`${basePath}#photography`"> Photography </ion-breadcrumb>
        <ion-breadcrumb :href="`${basePath}#cameras`"> Cameras </ion-breadcrumb>
        <ion-breadcrumb :href="`${basePath}#film`"> Film </ion-breadcrumb>
        <ion-breadcrumb> 35 mm </ion-breadcrumb>
      </ion-breadcrumbs>
      <hr />
      <h1>Color: Danger</h1>
      <ion-breadcrumbs id="color" color="danger">
        <ion-breadcrumb :href="homePath"> Home </ion-breadcrumb>
        <ion-breadcrumb :href="`${basePath}#electronics`"> Electronics </ion-breadcrumb>
        <ion-breadcrumb :href="`${basePath}#photography`"> Photography </ion-breadcrumb>
        <ion-breadcrumb :href="`${basePath}#cameras`"> Cameras </ion-breadcrumb>
        <ion-breadcrumb :href="`${basePath}#film`"> Film </ion-breadcrumb>
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
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// Build absolute hrefs so hash navigation works under <base href="/"> and
// matches the current route regardless of the deploy sub-path (e.g. /vue/).
const basePath = computed(
  () => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${route.path}`,
);
const homePath = import.meta.env.BASE_URL;
</script>
