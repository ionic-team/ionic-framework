<template>
  <ion-page data-pageid="tab-lifecycle-home">
    <ion-header>
      <ion-toolbar>
        <ion-title>Home Tab</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-outside-home" router-link="/tab-lifecycle-outside">Go Outside Tabs</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  onIonViewDidLeave,
  onIonViewWillEnter,
  onIonViewWillLeave,
} from '@ionic/vue';
import { defineComponent } from 'vue';

import { logLifecycle } from './lifecycle-log';

export default defineComponent({
  components: {
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup() {
    onIonViewWillEnter(() => logLifecycle('home:ionViewWillEnter'));
    onIonViewDidEnter(() => logLifecycle('home:ionViewDidEnter'));
    onIonViewWillLeave(() => logLifecycle('home:ionViewWillLeave'));
    onIonViewDidLeave(() => logLifecycle('home:ionViewDidLeave'));
  },
});
</script>
