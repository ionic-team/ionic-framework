<template>
  <ion-page data-pageid="tabs-search-params-tab2">
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div data-testid="tab2-query">{{ queryString }}</div>
      <div data-testid="tab2-baz">{{ baz }}</div>
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
    const queryString = computed(() =>
      new URLSearchParams(route.query as Record<string, string>).toString()
    );
    const baz = computed(() => (route.query.baz as string) ?? '');
    return { queryString, baz };
  },
});
</script>
