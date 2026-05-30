<template>
  <ion-page data-pageid="tabs-search-params-tab4">
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 4</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div data-testid="tab4-q">{{ q }}</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  components: { IonContent, IonHeader, IonPage, IonTitle, IonToolbar },
  setup() {
    const route = useRoute();
    const q = computed(() => (route.query.q as string) ?? '');
    return { q };
  },
});
</script>
