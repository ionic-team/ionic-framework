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
    <div id="nav-root-params">Message: {{ message }}</div>
    <ion-button expand="block" @click="pushPage" id="push-nav-child"
      >Go to Nav Child</ion-button
    >
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  modalController,
} from "@ionic/vue";
import NavChild from "@/components/NavChild.vue";

defineProps<{
  message: string;
}>();

function pushPage() {
  const ionNav = document.querySelector("ion-nav") as any;
  ionNav.push(NavChild, { title: "Custom Title" });
}

async function dismiss() {
  await modalController.dismiss();
}
</script>
