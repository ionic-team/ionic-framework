<template>
  <ion-page data-pageid="folder">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ folder }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ folder }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong class="capitalize">{{ folder }}</strong>
        <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue';

export default {
  name: 'Folder',
  components: {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
  },
  setup() {
    const route = useRoute();
    const folder = ref(route.params.id || 'Inbox');
    const matchedFolder = computed(() => route.params.id);

    watch(matchedFolder, () => {
      folder.value = matchedFolder.value as string;
    })

    return { folder }
  }
}
</script>

<style scoped>
  #container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  #container strong {
    font-size: 20px;
    line-height: 26px;
  }

  #container p {
    font-size: 16px;
    line-height: 22px;
    color: #8c8c8c;
    margin: 0;
  }

  #container a {
    text-decoration: none;
  }
</style>
