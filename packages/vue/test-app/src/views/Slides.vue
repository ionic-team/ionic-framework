<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Slides</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Slides</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-slides @ionSlideDidChange="checkIndex" ref="slidesRef">
        <ion-slide v-for="slide in slides" :key="slide.id">
          {{ slide.text }}
        </ion-slide>
      </ion-slides>

      <div class="ion-padding">
        <ion-button expand="block" @click="slidePrevious">Previous</ion-button>
        <ion-button expand="block" @click="slideNext">Next</ion-button>

        <br>

        Slides Index: {{ slidesIndex }}
      </div>
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
  IonPage,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonSlide,
    IonSlides,
    IonTitle,
    IonToolbar
  },
  data() {
    return {
      slides: [
        { text: 'Slide 0', id: 0 },
        { text: 'Slide 1', id: 1 },
        { text: 'Slide 2', id: 2 }
      ]
    }
  },
  setup() {
    const slidesRef = ref();
    const slidesIndex = ref(0);

    const checkIndex = async () => {
      slidesIndex.value = await slidesRef.value.$el.getActiveIndex();
    }

    const slideNext = () => {
      slidesRef.value.$el.slideNext();
    }

    const slidePrevious = () => {
      slidesRef.value.$el.slidePrev();
    }

    return {
      slidesRef,
      slidesIndex,

      checkIndex,
      slideNext,
      slidePrevious
    }
  }
});
</script>

<style scoped>
ion-slides {
  height: 200px;
}

ion-slide:nth-of-type(1) {
  background: #0088cc;
}

ion-slide:nth-of-type(2) {
  background: #0021cc;
}

ion-slide:nth-of-type(3) {
  background: #00ccaa;
}
</style>
