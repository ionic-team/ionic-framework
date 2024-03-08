<template>
  <ion-page data-pageid="modal-multiple-children">
    <ion-content class="ion-padding" :fullscreen="true">
      <ion-button id="show-modal">Show Modal</ion-button>

      <ion-modal trigger="show-modal">
        <div class="child-content">Content A</div>
        <div class="child-content">Content B</div>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonPage, IonModal } from '@ionic/vue';
</script>
