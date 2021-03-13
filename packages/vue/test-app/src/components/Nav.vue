<template>
  <ion-nav :root="NavRoot"></ion-nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonNav } from '@ionic/vue';
import NavRoot from '@/components/NavRoot.vue';

export default defineComponent({
  components: { IonNav },
  setup() {
    return { NavRoot }
  }
});
</script>
