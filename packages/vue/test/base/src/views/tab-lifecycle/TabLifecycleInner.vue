<template>
  <ion-page data-pageid="tab-lifecycle-inner">
    <ion-header>
      <ion-toolbar>
        <ion-title>Inner Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-outside-inner" router-link="/tab-lifecycle-outside">Go Outside Tabs</ion-button>
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
    onIonViewWillEnter(() => logLifecycle('inner:ionViewWillEnter'));
    onIonViewDidEnter(() => logLifecycle('inner:ionViewDidEnter'));
    onIonViewWillLeave(() => logLifecycle('inner:ionViewWillLeave'));
    onIonViewDidLeave(() => logLifecycle('inner:ionViewDidLeave'));
  },
});
</script>
