<template>
  <ion-page :class="{
    'ion-page-additional-class': true
  }" data-pageid="ion-page-class">
    <ion-content>
      Some content
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-button router-link="/navigation" id="navigation">
          Button
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonButton, IonContent, IonFooter, IonPage, IonToolbar } from '@ionic/vue';

export default defineComponent({
  name: 'IonPageClassObject',
  components: { IonButton, IonContent, IonFooter, IonPage, IonToolbar },
})
</script>
