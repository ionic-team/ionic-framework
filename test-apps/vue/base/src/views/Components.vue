<template>
  <ion-page>
    <ion-content>
      <ion-list>
        <ion-item button router-link="/components/breadcrumbs">
          <ion-label>Breadcrumbs</ion-label>
        </ion-item>
        <ion-item button router-link="/components/select">
          <ion-label>Select</ion-label>
        </ion-item>
        <ion-item button router-link="/components/range">
          <ion-label>Range</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonPage, IonContent, IonList, IonItem, IonLabel } from "@ionic/vue";

export default defineComponent({
  components: { IonPage, IonContent, IonList, IonItem, IonLabel },
});
</script>
