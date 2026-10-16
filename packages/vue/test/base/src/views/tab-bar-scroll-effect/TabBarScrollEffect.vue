<template>
  <ion-page data-pageid="tab-bar-scroll-effect">
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" :scroll-effect="scrollEffect">
        <ion-tab-button tab="home" href="/tab-bar-scroll-effect/home">
          <ion-icon :icon="triangle" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="other" href="/tab-bar-scroll-effect/other">
          <ion-icon :icon="square" />
          <ion-label>Other</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/vue";
import { square, triangle } from "ionicons/icons";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonIcon,
    IonLabel,
    IonPage,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
  },
  setup() {
    // The tests open the page with ?effect=fade to use the fade effect
    const effect = new URLSearchParams(window.location.search).get("effect");
    const scrollEffect = effect === "fade" ? "fade" : "hide";

    return { scrollEffect, square, triangle };
  },
});
</script>
