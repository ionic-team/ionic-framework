<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Range</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form>
        <ion-list>
          <ion-item>
            <ion-range :min="0" :max="20" :value="5" v-model="range">
              <div slot="label">Range</div>
            </ion-range>
          </ion-item>
          <p>Value: {{ range }}</p>
        </ion-list>
      </form>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonRange
} from "@ionic/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    IonPage,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonRange
  },
  data() {
    return {
      range: 5
    }
  }
});
</script>
