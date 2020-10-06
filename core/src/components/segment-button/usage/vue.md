```html
<template>
  <!-- Segment buttons with text and click listener -->
  <ion-segment @ionChange="segmentChanged($event)">
    <ion-segment-button>
      <ion-label>Friends</ion-label>
    </ion-segment-button>
    <ion-segment-button>
      <ion-label>Enemies</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment buttons with the first checked and the last disabled -->
  <ion-segment value="paid">
    <ion-segment-button value="paid">
      <ion-label>Paid</ion-label>
    </ion-segment-button>
    <ion-segment-button value="free">
      <ion-label>Free</ion-label>
    </ion-segment-button>
    <ion-segment-button disabled value="top">
      <ion-label>Top</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment buttons with values and icons -->
  <ion-segment>
    <ion-segment-button value="camera">
      <ion-icon :icon="camera"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="bookmark">
      <ion-icon :icon="bookmark"></ion-icon>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment with a value that checks the last button -->
  <ion-segment value="shared">
    <ion-segment-button value="bookmarks">
      <ion-label>Bookmarks</ion-label>
    </ion-segment-button>
    <ion-segment-button value="reading">
      <ion-label>Reading List</ion-label>
    </ion-segment-button>
    <ion-segment-button value="shared">
      <ion-label>Shared Links</ion-label>
    </ion-segment-button>
  </ion-segment>
  
  <!-- Label only -->
  <ion-segment value="1">
    <ion-segment-button value="1">
      <ion-label>Item One</ion-label>
    </ion-segment-button>
    <ion-segment-button value="2">
      <ion-label>Item Two</ion-label>
    </ion-segment-button>
    <ion-segment-button value="3">
      <ion-label>Item Three</ion-label>
    </ion-segment-button>
  </ion-segment>
  
  <!-- Icon only -->
  <ion-segment value="heart">
    <ion-segment-button value="call">
      <ion-icon :icon="call"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="heart">
      <ion-icon :icon="heart"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="pin">
      <ion-icon :icon="pin"></ion-icon>
    </ion-segment-button>
  </ion-segment>
  
  <!-- Icon top -->
  <ion-segment value="2">
    <ion-segment-button value="1">
      <ion-label>Item One</ion-label>
      <ion-icon :icon="call"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="2">
      <ion-label>Item Two</ion-label>
      <ion-icon :icon="heart"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="3">
      <ion-label>Item Three</ion-label>
      <ion-icon :icon="pin"></ion-icon>
    </ion-segment-button>
  </ion-segment>
  
  <!-- Icon bottom -->
  <ion-segment value="1">
    <ion-segment-button value="1" layout="icon-bottom">
      <ion-icon :icon="call"></ion-icon>
      <ion-label>Item One</ion-label>
    </ion-segment-button>
    <ion-segment-button value="2" layout="icon-bottom">
      <ion-icon :icon="heart"></ion-icon>
      <ion-label>Item Two</ion-label>
    </ion-segment-button>
    <ion-segment-button value="3" layout="icon-bottom">
      <ion-icon :icon="pin"></ion-icon>
      <ion-label>Item Three</ion-label>
    </ion-segment-button>
  </ion-segment>
  
  <!-- Icon start -->
  <ion-segment value="1">
    <ion-segment-button value="1" layout="icon-start">
      <ion-label>Item One</ion-label>
      <ion-icon :icon="call"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="2" layout="icon-start">
      <ion-label>Item Two</ion-label>
      <ion-icon :icon="heart"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="3" layout="icon-start">
      <ion-label>Item Three</ion-label>
      <ion-icon :icon="pin"></ion-icon>
    </ion-segment-button>
  </ion-segment>
  
  <!-- Icon end -->
  <ion-segment value="1">
    <ion-segment-button value="1" layout="icon-end">
      <ion-icon :icon="call"></ion-icon>
      <ion-label>Item One</ion-label>
    </ion-segment-button>
    <ion-segment-button value="2" disabled layout="icon-end">
      <ion-icon :icon="heart"></ion-icon>
      <ion-label>Item Two</ion-label>
    </ion-segment-button>
    <ion-segment-button value="3" layout="icon-end">
      <ion-icon :icon="pin"></ion-icon>
      <ion-label>Item Three</ion-label>
    </ion-segment-button>
  </ion-segment>
</template>

<script lang="ts">
import { IonIcon, IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';
import { bookmark, call, camera, heart, pin } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonIcon, IonLabel, IonSegment, IonSegmentButtonr },
  methods: {
    segmentChanged(ev: CustomEvent) {
      console.log('Segment changed', ev);
    }
  }
  setup() {
    return { 
      bookmark, 
      call, 
      camera, 
      heart, 
      pin
    }
  }
});
</script>
```
