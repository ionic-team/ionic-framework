<template>
  <ion-page data-pageid="tabs-standalone">
    <ion-content>
      <div id="active-tab">{{ activeTab }}</div>
    </ion-content>
    <ion-footer>
      <ion-tab-bar>
        <ion-tab-button tab="tab1" @click="activeTab = 'tab1'">
          <ion-icon :icon="triangle" />
          <ion-label>Tab 1</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="tab2" @click="activeTab = 'tab2'">
          <ion-icon :icon="ellipse" />
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="routing" @click="router.push('/routing')">
          <ion-icon :icon="square" />
          <ion-label>Routing</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonFooter, IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

/**
 * An ion-tab-bar with no ion-tabs or ion-router-outlet around it. The app
 * owns the active tab and navigates by method from the tab buttons.
 */
export default defineComponent({
  components: { IonContent, IonFooter, IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton },
  setup() {
    const router = useRouter();
    const activeTab = ref('tab1');

    return { router, activeTab, ellipse, square, triangle };
  }
});
</script>
