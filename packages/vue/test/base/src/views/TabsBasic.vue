<template>
  <ion-page data-pageid="tabs">
    <ion-content>
      <ion-tabs id="tabs" ref="tabsRef" @ionTabsWillChange="onTabWillChange" @ionTabsDidChange="onTabDidChange">
        <div slot="top">
          <button id="select-tab3" @click="selectTab3">Select Tab 3</button>
          <p>
            Active tab on ionTabsDidChange: <span id="did-change-active-tab">{{ didChangeActiveTab }}</span>
          </p>
        </div>

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

        <ion-tab tab="tab1" data-pageid="tab1">
          <ion-label>Tab 1 Content</ion-label>
        </ion-tab>
        <ion-tab tab="tab2" data-pageid="tab2">
          <ion-label>Tab 2 Content</ion-label>
        </ion-tab>
        <ion-tab tab="tab3" data-pageid="tab3">
          <ion-label>Tab 3 Content</ion-label>
        </ion-tab>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonContent, IonLabel, IonIcon, IonPage, IonTab } from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
import { ref, defineComponent } from 'vue';

export default defineComponent({
  components: { IonContent, IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonTab },
  setup() {
    const tabs = ref([
      { id: 1, icon: triangle },
      { id: 2, icon: ellipse },
      { id: 3, icon: square }
    ])

    const onTabWillChange = (e: { tab: string }) => {
      console.log('ionTabsWillChange', e.tab);
    }

    const tabsRef = ref();
    const didChangeActiveTab = ref('');

    const onTabDidChange = (e: { tab: string }) => {
      console.log('ionTabsDidChange', e.tab);

      const activeTab = Array.from(document.querySelectorAll('ion-tab')).find((tab) => tab.active);
      didChangeActiveTab.value = activeTab?.getAttribute('data-pageid') ?? 'none';
    }

    const selectTab3 = () => {
      tabsRef.value.$el.select('tab3');
    }

    return { tabs, tabsRef, didChangeActiveTab, onTabWillChange, onTabDidChange, selectTab3 }
  }
});
</script>
