```html
<template>
  <ion-menu side="start" menu-id="first" content-id="main">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Example Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>Menu Item</ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

  <div class="ion-page" id="main">
    <ion-content>
      <ion-menu-toggle>
        <ion-button>Toggle Menu</ion-button>
      </ion-menu-toggle>
    </ion-content>
  </div>
</template>

<script>
import { 
  IonContent, 
  IonHeader, 
  IonItem, 
  IonList, 
  IonMenu, 
  IonMenuToggle,
  IonButton,
  IonTitle, 
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonContent, 
    IonHeader, 
    IonItem, 
    IonList, 
    IonMenu, 
    IonMenuToggle,
    IonButton,
    IonTitle, 
    IonToolbar
  }
});
</script>
```