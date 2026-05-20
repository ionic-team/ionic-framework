<template>
  <ion-page data-pageid="tabs-search-params">
    <ion-content>
      <ion-tabs id="tabs-search-params">
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button
            tab="tab1"
            href="/tabs-search-params/tab1?foo=bar"
            data-testid="tab1"
          >
            <ion-icon :icon="triangle" />
            <ion-label>Tab 1</ion-label>
          </ion-tab-button>
          <ion-tab-button
            tab="tab2"
            href="/tabs-search-params/tab2?baz=qux"
            data-testid="tab2"
          >
            <ion-icon :icon="square" />
            <ion-label>Tab 2</ion-label>
          </ion-tab-button>
          <ion-tab-button
            tab="tab3"
            href="/tabs-search-params/tab3?x=1&y=2#section"
            data-testid="tab3"
          >
            <ion-icon :icon="triangle" />
            <ion-label>Tab 3</ion-label>
          </ion-tab-button>
          <ion-tab-button
            tab="tab4"
            href="/tabs-search-params/tab4?q=hello%20world"
            data-testid="tab4"
          >
            <ion-icon :icon="square" />
            <ion-label>Tab 4</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
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
import { square, triangle } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonContent,
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
