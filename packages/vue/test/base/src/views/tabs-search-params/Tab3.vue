<template>
  <ion-page data-pageid="tabs-search-params-tab3">
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 3</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div data-testid="tab3-x">{{ x }}</div>
      <div data-testid="tab3-y">{{ y }}</div>
      <div data-testid="tab3-hash">{{ hash }}</div>
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
    const x = computed(() => (route.query.x as string) ?? '');
    const y = computed(() => (route.query.y as string) ?? '');
    const hash = computed(() => route.hash ?? '');
    return { x, y, hash };
  },
});
</script>
