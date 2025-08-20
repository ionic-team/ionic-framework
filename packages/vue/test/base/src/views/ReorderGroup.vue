<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Reorder Group</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-reorder-group :disabled="false" @ion-reorder-end="onReorderEnd">
        <ion-item>
          <ion-reorder slot="end"></ion-reorder>
          <ion-label>Item 1</ion-label>
        </ion-item>
        <ion-item>
          <ion-reorder slot="end"></ion-reorder>
          <ion-label>Item 2</ion-label>
        </ion-item>
        <ion-item>
          <ion-reorder slot="end"></ion-reorder>
          <ion-label>Item 3</ion-label>
        </ion-item>
      </ion-reorder-group>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonReorder,
  IonReorderGroup,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { defineComponent } from "vue";
import type { ReorderEndCustomEvent } from "@ionic/vue";

export default defineComponent({
  components: {
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonPage,
    IonReorder,
    IonReorderGroup,
    IonTitle,
    IonToolbar,
  },
  setup() {
    const onReorderEnd = (event: ReorderEndCustomEvent) => {
      if (event.detail.from !== event.detail.to) {
        console.log('ionReorderEnd: Dragged from index', event.detail.from, 'to', event.detail.to);
      } else {
        console.log('ionReorderEnd: No position change occurred');
      }

      event.detail.complete();
    };

    return {
      onReorderEnd,
    };
  },
});
</script>
