<template>
  <ion-page data-pageid="icons">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Icons</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Icons</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item>
          <ion-icon slot="start" :icon="heart"></ion-icon>
          <ion-label>Static Icons</ion-label>
          <ion-icon slot="end" :icon="personCircleOutline"></ion-icon>
          <ion-icon slot="end" :icon="trash"></ion-icon>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :icon="dynamic"></ion-icon>
          <ion-label>Dynamic Icon</ion-label>
          <ion-button slot="end" fill="outline" @click="toggle">
            Toggle Icon
          </ion-button>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :ios="heartCircleOutline" :md="personCircleOutline"></ion-icon>
          <ion-label>
            <p>ios: heart circle</p>
            <p>md: person circle</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :ios="starOutline" :md="star"></ion-icon>
          <ion-label>
            <p>ios: star outline</p>
            <p>md: star</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :ios="starOutline" :md="star"></ion-icon>
          <ion-label>
            <p>ios: star outline</p>
            <p>md: star</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" mode="ios" :ios="starOutline" :md="star"></ion-icon>
          <ion-label>
            <h3>mode: ios</h3>
            <p>ios: star outline</p>
            <p>md: star</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" mode="md" :ios="starOutline" :md="star"></ion-icon>
          <ion-label>
            <h3>mode: md</h3>
            <p>ios: star outline</p>
            <p>md: star</p>
          </ion-label>
        </ion-item>
      </ion-list>


    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { heart, heartCircleOutline, personCircleOutline, star, starOutline, trash } from 'ionicons/icons';

export default defineComponent({
  components: {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar
  },
  setup() {
    const dynamic = ref(star);

    const toggle = () => {
      const current = dynamic.value;
      dynamic.value = current === star ? starOutline : star;
    }

    return {
      dynamic,

      heart,
      heartCircleOutline,
      personCircleOutline,
      star,
      starOutline,
      trash,

      toggle
    }
  }
});
</script>
