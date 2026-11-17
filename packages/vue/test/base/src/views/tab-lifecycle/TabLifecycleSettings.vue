<template>
  <ion-page data-pageid="tab-lifecycle-settings">
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings Tab</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button id="go-outside-settings" router-link="/tab-lifecycle-outside">Go Outside Tabs</ion-button>
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
    onIonViewWillEnter(() => logLifecycle('settings:ionViewWillEnter'));
    onIonViewDidEnter(() => logLifecycle('settings:ionViewDidEnter'));
    onIonViewWillLeave(() => logLifecycle('settings:ionViewWillLeave'));
    onIonViewDidLeave(() => logLifecycle('settings:ionViewDidLeave'));
  },
});
</script>
