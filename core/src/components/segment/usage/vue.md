```html
<template>
  <!-- Default Segment -->
  <ion-segment @ionChange="segmentChanged($event)">
    <ion-segment-button value="friends">
      <ion-label>Friends</ion-label>
    </ion-segment-button>
    <ion-segment-button value="enemies">
      <ion-label>Enemies</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Disabled Segment -->
  <ion-segment @ionChange="segmentChanged($event)" disabled value="sunny">
    <ion-segment-button value="sunny">
      <ion-label>Sunny</ion-label>
    </ion-segment-button>
    <ion-segment-button value="rainy">
      <ion-label>Rainy</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment with anchors -->
  <ion-segment @ionChange="segmentChanged($event)">
    <ion-segment-button value="dogs">
      <ion-label>Dogs</ion-label>
    </ion-segment-button>
    <ion-segment-button value="cats">
      <ion-label>Cats</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Scrollable Segment -->
  <ion-segment scrollable value="heart">
    <ion-segment-button value="home">
      <ion-icon name="home"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="heart">
      <ion-icon name="heart"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="pin">
      <ion-icon name="pin"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="star">
      <ion-icon name="star"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="call">
      <ion-icon name="call"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="globe">
      <ion-icon name="globe"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="basket">
      <ion-icon name="basket"></ion-icon>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment with secondary color -->
  <ion-segment @ionChange="segmentChanged($event)" color="secondary">
    <ion-segment-button value="standard">
      <ion-label>Standard</ion-label>
    </ion-segment-button>
    <ion-segment-button value="hybrid">
      <ion-label>Hybrid</ion-label>
    </ion-segment-button>
    <ion-segment-button value="sat">
      <ion-label>Satellite</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment in a toolbar -->
  <ion-toolbar>
    <ion-segment @ionChange="segmentChanged($event)">
      <ion-segment-button value="camera">
        <ion-icon name="camera"></ion-icon>
      </ion-segment-button>
      <ion-segment-button value="bookmark">
        <ion-icon name="bookmark"></ion-icon>
      </ion-segment-button>
    </ion-segment>
  </ion-toolbar>

  <!-- Segment with default selection -->
  <ion-segment @ionChange="segmentChanged($event)" value="javascript">
    <ion-segment-button value="python">
      <ion-label>Python</ion-label>
    </ion-segment-button>
    <ion-segment-button value="javascript">
      <ion-label>Javascript</ion-label>
    </ion-segment-button>
  </ion-segment>
</template>

<script lang="ts">
import { IonSegment, IonSegmentButton, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonSegment, IonSegmentButton, IonToolbar },
  methods: {
    segmentChanged(ev: CustomEvent) {
      console.log('Segment changed', ev);
    }
  }
});
</script>
```
