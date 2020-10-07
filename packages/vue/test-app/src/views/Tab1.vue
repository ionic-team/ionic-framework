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

      <ion-item router-link="tab1/child-one" id="child-one">
        <ion-label>Go to Tab 1 Child 1</ion-label>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
<<<<<<< HEAD
import { IonItem, IonLabel, IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
=======
import { IonButtons, IonBackButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
>>>>>>> origin/ionic-vue
import ExploreContainer from '@/components/ExploreContainer.vue';

export default  {
  name: 'Tab1',
<<<<<<< HEAD
  components: { IonItem, IonLabel, ExploreContainer, IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
=======
  components: { IonButtons, IonBackButton, ExploreContainer, IonHeader, IonToolbar, IonTitle, IonContent, IonPage }
>>>>>>> origin/ionic-vue
}
</script>
