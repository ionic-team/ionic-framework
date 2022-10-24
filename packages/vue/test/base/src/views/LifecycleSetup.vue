<template>
  <ion-page data-pageid="lifecycle-setup">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Lifecycle (Setup)</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Lifecycle (Setup)</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        onIonViewWillEnter: <div id="onWillEnter">{{ onWillEnter }}</div><br />
        onIonViewDidEnter: <div id="onDidEnter">{{ onDidEnter }}</div><br />
        onIonViewWillLeave: <div id="onWillLeave">{{ onWillLeave }}</div><br />
        onIonViewDidLeave: <div id="onDidLeave">{{ onDidLeave }}</div><br />

        <ion-button router-link="/navigation" id="lifecycle-navigation">Go to another page</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonButton,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
  onIonViewDidEnter,
  onIonViewWillLeave,
  onIonViewDidLeave
} from '@ionic/vue';
import { ref } from 'vue';
const onWillEnter = ref(0);
const onDidEnter = ref(0);
const onWillLeave = ref(0);
const onDidLeave = ref(0);

onIonViewWillEnter(() => onWillEnter.value += 1);
onIonViewDidEnter(() => onDidEnter.value += 1);
onIonViewWillLeave(() => onWillLeave.value += 1);
onIonViewDidLeave(() => onDidLeave.value += 1);
</script>
