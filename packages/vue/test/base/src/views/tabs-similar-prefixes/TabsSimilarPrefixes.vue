<template>
  <ion-page data-pageid="tabs-similar-prefixes">
    <ion-content>
      <ion-tabs id="tabs-similar-prefixes">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom" data-testid="tab-bar">
          <ion-tab-button
            tab="home"
            href="/tabs-similar-prefixes/home"
            data-testid="home-tab"
            id="tab-button-home"
          >
            <ion-icon :icon="homeOutline" />
            <ion-label>Home</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="home2"
            href="/tabs-similar-prefixes/home2"
            data-testid="home2-tab"
            id="tab-button-home2"
          >
            <ion-icon :icon="radioOutline" />
            <ion-label>Home 2</ion-label>
          </ion-tab-button>

          <ion-tab-button
            tab="home3"
            href="/tabs-similar-prefixes/home3"
            data-testid="home3-tab"
            id="tab-button-home3"
          >
            <ion-icon :icon="libraryOutline" />
            <ion-label>Home 3</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue';
import { homeOutline, radioOutline, libraryOutline } from 'ionicons/icons';
</script>
