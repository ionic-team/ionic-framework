<template>
  <ion-page data-pageid="routeroutlet">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button id="routeroutlet-back-button" text="Back to main outlet"></ion-back-button>
          <ion-button id="inbox" router-link="/nested/inbox" router-direction="root">Inbox</ion-button>
          <ion-button id="trash" router-link="/nested/trash" router-direction="root">Trash</ion-button>
          <ion-button id="outbox" router-link="/nested/outbox" router-direction="root">Outbox</ion-button>
          <ion-button id="spam" router-link="/nested/spam" router-direction="root">Spam</ion-button>
          <ion-button id="other" router-link="/nested/two" router-direction="root">Other</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-router-outlet></ion-router-outlet>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonHeader,
  IonButtons,
  IonButton,
  IonToolbar,
  IonContent,
  IonPage,
  IonRouterOutlet,
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonBackButton,
    IonHeader,
    IonButtons,
    IonButton,
    IonToolbar,
    IonContent,
    IonPage,
    IonRouterOutlet
  }
});
</script>
