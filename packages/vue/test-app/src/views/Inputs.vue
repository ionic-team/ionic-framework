<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Inputs</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Inputs</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item>
        <ion-label>Checkbox</ion-label>
        <ion-checkbox slot="start" v-model="checkbox"></ion-checkbox>
      </ion-item>

      <ion-item>
        <ion-label>Toggle</ion-label>
        <ion-toggle slot="end" v-model="toggle"></ion-toggle>
      </ion-item>

      <ion-item>
        <ion-label>Input</ion-label>
        <ion-input slot="end" v-model="input"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label>Range</ion-label>
        <ion-range :dual-knobs="true" :min="0" :max="100" slot="end" v-model="range"></ion-range>
      </ion-item>

      <div class="ion-padding">
        Checkbox: {{ checkbox }}<br>
        Toggle: {{ toggle }}<br>
        Input: {{ input }}<br>
        Range: {{ range }}<br><br>

        <ion-button expand="block" @click="reset" id="reset">Reset Values</ion-button>
        <ion-button expand="block" @click="set" id="set">Set Values</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRange,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonRange,
    IonTitle,
    IonToggle,
    IonToolbar
  },
  setup() {
    const checkbox = ref(false);
    const toggle = ref(false);
    const input = ref('');
    const range = ref({
      lower: 30,
      upper: 70
    });

    const reset = () => {
      checkbox.value = false;
      toggle.value = false;
      input.value = '';
      range.value = {
        lower: 30,
        upper: 70
      };
    }

    const set = () => {
      checkbox.value = true;
      toggle.value = true;
      input.value = 'Hello World';
      range.value = {
        lower: 10,
        upper: 90
      }
    }

    return {
      checkbox,
      toggle,
      input,
      range,

      reset,
      set
    }
  }
});
</script>
