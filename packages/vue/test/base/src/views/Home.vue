<template>
  <ion-page data-pageid="home">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Test App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Test App</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-list-header>
          <ion-label>Overlays</ion-label>
        </ion-list-header>
        <ion-item router-link="/overlays">
          <ion-label>Overlays</ion-label>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>Navigation</ion-label>
        </ion-list-header>
        <ion-item router-link="/navigation" id="navigation">
          <ion-label>Navigation</ion-label>
        </ion-item>
        <ion-item router-link="/routing" id="routing">
          <ion-label>Routing</ion-label>
        </ion-item>
        <ion-item router-link="/default-href" id="default-href">
          <ion-label>Default Href</ion-label>
        </ion-item>
        <ion-item router-link="/nested" id="nested">
          <ion-label>Nested Router Outlet</ion-label>
        </ion-item>
        <ion-item router-link="/tabs" id="tabs">
          <ion-label>Tabs</ion-label>
        </ion-item>
        <ion-item router-link="/tabs-secondary" id="tab-secondary">
          <ion-label>Tabs Secondary</ion-label>
        </ion-item>
        <ion-item router-link="/tabs-basic" id="tab-basic">
          <ion-label>Tabs with Basic Navigation</ion-label>
        </ion-item>
        <ion-item router-link="/lifecycle" id="lifecycle">
          <ion-label>Lifecycle</ion-label>
        </ion-item>
        <ion-item router-link="/lifecycle-setup" id="lifecycle-setup">
          <ion-label>Lifecycle (Setup)</ion-label>
        </ion-item>
        <ion-item router-link="/delayed-redirect" id="delayed-redirect">
          <ion-label>Delayed Redirect</ion-label>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>Components</ion-label>
        </ion-list-header>
        <ion-item router-link="/components/breadcrumbs">
          <ion-label>Breadcrumbs</ion-label>
        </ion-item>
        <ion-item router-link="/icons">
          <ion-label>Icons</ion-label>
        </ion-item>
        <ion-item router-link="/inputs">
          <ion-label>Inputs</ion-label>
        </ion-item>
        <ion-item router-link="/components/range">
          <ion-label>Range</ion-label>
        </ion-item>
        <ion-item router-link="/reorder-group">
          <ion-label>Reorder Group</ion-label>
        </ion-item>
        <ion-item router-link="/components/select">
          <ion-label>Select</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
</script>
