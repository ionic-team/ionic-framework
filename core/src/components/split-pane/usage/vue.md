```html
<template>
  <ion-split-pane content-id="main">
    <!--  the side menu  -->
    <ion-menu content-id="main">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-menu>

    <!-- the main content -->
    <ion-router-outlet id="main"></ion-router-outlet>
  </ion-split-pane>
</template>

<script>
import { 
  IonHeader, 
  IonMenu, 
  IonRouterOutlet, 
  IonSplitPane, 
  IonTitle, 
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonHeader, 
    IonMenu, 
    IonRouterOutlet, 
    IonSplitPane, 
    IonTitle, 
    IonToolbar
  }
});
</script>
```
