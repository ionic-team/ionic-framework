<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title id="lifecycle-error">{{ message }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-router-outlet />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/vue';
import { onErrorCaptured, ref } from 'vue';

const message = ref('No error captured');
onErrorCaptured((error) => {
  message.value = error instanceof Error ? error.message : String(error);
  return false;
});
</script>
