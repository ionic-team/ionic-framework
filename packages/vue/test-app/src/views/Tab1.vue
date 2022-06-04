<template>
  <ion-page data-pageid="tab1">
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Tab 1 page" />

      <ion-item button router-link="/tabs/tab1/childone" id="child-one">
        <ion-label>Go to Tab 1 Child 1</ion-label>
      </ion-item>
      <ion-item button router-link="/nested" id="nested">
        <ion-label>Go to Nested Outlet</ion-label>
      </ion-item>

      <ion-item button router-link="/tabs-secondary" id="tabs-secondary">
        <ion-label>Go to Secondary Tabs</ion-label>
      </ion-item>

      <ion-item button router-link="/tabs" id="tabs-primary">
        <ion-label>Go to Primary Tabs</ion-label>
      </ion-item>

      <ion-item router-link="/tabs/tab1/child-one?key=value" id="child-one-query-string">
        <ion-label>Go to Tab 1 Child 1 with Query Params</ion-label>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonButtons, IonBackButton, IonPage, IonHeader, IonItem, IonLabel, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';

export default  {
  components: { IonButtons, IonBackButton, ExploreContainer, IonHeader, IonItem, IonLabel, IonToolbar, IonTitle, IonContent, IonPage }
}
</script>
