<template>
  <ion-page data-pageid="tab-tap-home">
    <ion-header>
      <ion-toolbar>
        <ion-title>Home Tab</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item id="go-to-child" router-link="/tab-tap/home/child">
          <ion-label>Go to child</ion-label>
        </ion-item>
        <ion-item v-for="i in 100" :key="i">
          <ion-label>Item {{ i }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
  },
});
</script>
