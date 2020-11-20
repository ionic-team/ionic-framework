```html
<template>
  <ion-tabs>
    <!-- Tab bar -->
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="schedule">
        <ion-icon :icon="calendar"></ion-icon>
        <ion-label>Schedule</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="speakers">
        <ion-icon :icon="person-circle"></ion-icon>
        <ion-label>Speakers</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="map">
        <ion-icon :icon="map"></ion-icon>
        <ion-label>Map</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="about">
        <ion-icon :icon="informationCircle"></ion-icon>
        <ion-label>About</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script>
import { 
  IonIcon, 
  IonLabel, 
  IonTabBar, 
  IonTabButton, 
  IonTabs
} from '@ionic/vue';
import { calendar, informationCircle, map, personCircle } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonIcon, 
    IonLabel, 
    IonTabBar, 
    IonTabButton, 
    IonTabs
  },
  setup() {
    return { calendar, informationCircle, map, personCircle }
  }
});
</script>
```
