<template>
  <ion-page data-pageid="tabs">
    <ion-content>
      <ion-tabs id="tabs">
        <ion-tab-bar slot="bottom">
          <ion-tab-button
            v-for="tab in tabs"
            :tab="'tab' + tab.id"
            :key="tab.id"
          >
            <ion-icon :icon="tab.icon" />
            <ion-label>Tab {{ tab.id }}</ion-label>
          </ion-tab-button>
        </ion-tab-bar>

        <!-- <ion-tab
          v-for="tab in tabs"
          :tab="'tab' + tab.id"
          :key="tab.id"
        >
          <ion-label>Tab {{ tab.id }} Content</ion-label>
        </ion-tab> -->
        <ion-tab tab="tab1">
          <ion-label>Tab 1 Content</ion-label>
        </ion-tab>
        <ion-tab tab="tab2">
          <ion-label>Tab 2 Content</ion-label>
        </ion-tab>
        <ion-tab tab="tab3">
          <ion-label>Tab 3 Content</ion-label>
        </ion-tab>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonContent, IonLabel, IonIcon, IonPage, IonTab } from '@ionic/vue';
import { ellipse, square, triangle, shield } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { ref, defineComponent } from 'vue';

export default defineComponent({
  components: { IonContent, IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonTab },
  setup() {
    const tabs = ref([
      { id: 1, icon: triangle },
      { id: 2, icon: ellipse },
      { id: 3, icon: square }
    ])

    return { tabs }
  }
});
</script>
