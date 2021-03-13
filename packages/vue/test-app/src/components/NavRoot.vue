<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-button @click="dismiss">Dismiss</ion-button>
      </ion-buttons>
      <ion-title>Nav - Root</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-button expand="block" @click="pushPage" id="push-nav-child">Go to Nav Child</ion-button>
  </ion-content>
</template>

<script lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  modalController
} from '@ionic/vue';
import { defineComponent } from 'vue';
import NavChild from '@/components/NavChild.vue';

export default defineComponent({
  components: {
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  },
  methods: {
    pushPage: function() {
      const ionNav = document.querySelector('ion-nav') as any;
      ionNav.push(NavChild, { title: 'Custom Title' });
    },
    dismiss: async function() {
      await modalController.dismiss();
    }
  }
})
</script>
