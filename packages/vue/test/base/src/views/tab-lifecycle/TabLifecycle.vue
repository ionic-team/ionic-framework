<template>
  <ion-page data-pageid="tab-lifecycle">
    <ion-tabs id="tab-lifecycle">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tab-lifecycle/home">
          <ion-icon :icon="triangle" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings" href="/tab-lifecycle/settings">
          <ion-icon :icon="square" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="nested" href="/tab-lifecycle/nested">
          <ion-icon :icon="triangle" />
          <ion-label>Nested</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { square, triangle } from 'ionicons/icons';
import { defineComponent } from 'vue';

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
    return { square, triangle };
  },
});
</script>
