```html
<template>
  <!-- Segment buttons with text and click listeners -->
  <ion-segment>
    <ion-segment-button @ionSelect="segmentButtonClicked($event)">
      <ion-label>Friends</ion-label>
    </ion-segment-button>
    <ion-segment-button @ionSelect="segmentButtonClicked($event)">
      <ion-label>Enemies</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment buttons with the first checked and the last disabled -->
  <ion-segment>
    <ion-segment-button checked>
      <ion-label>Paid</ion-label>
    </ion-segment-button>
    <ion-segment-button>
      <ion-label>Free</ion-label>
    </ion-segment-button>
    <ion-segment-button disabled>
      <ion-label>Top</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Segment buttons with values and icons -->
  <ion-segment>
    <ion-segment-button value="camera">
      <ion-icon name="camera"></ion-icon>
    </ion-segment-button>
    <ion-segment-button value="bookmark">
      <ion-icon name="bookmark"></ion-icon>
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
  <ion-segment>
    <ion-segment-button checked>
      <ion-label>Item One</ion-label>
    </ion-segment-button>
    <ion-segment-button>
      <ion-label>Item Two</ion-label>
    </ion-segment-button>
    <ion-segment-button>
      <ion-label>Item Three</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Icon only -->
  <ion-segment>
    <ion-segment-button>
      <ion-icon name="call"></ion-icon>
    </ion-segment-button>
    <ion-segment-button checked>
      <ion-icon name="heart"></ion-icon>
    </ion-segment-button>
    <ion-segment-button>
      <ion-icon name="pin"></ion-icon>
    </ion-segment-button>
  </ion-segment>

  <!-- Icon top -->
  <ion-segment>
    <ion-segment-button>
      <ion-label>Item One</ion-label>
      <ion-icon name="call"></ion-icon>
    </ion-segment-button>
    <ion-segment-button checked>
      <ion-label>Item Two</ion-label>
      <ion-icon name="heart"></ion-icon>
    </ion-segment-button>
    <ion-segment-button>
      <ion-label>Item Three</ion-label>
      <ion-icon name="pin"></ion-icon>
    </ion-segment-button>
  </ion-segment>

  <!-- Icon bottom -->
  <ion-segment>
    <ion-segment-button checked layout="icon-bottom">
      <ion-icon name="call"></ion-icon>
      <ion-label>Item One</ion-label>
    </ion-segment-button>
    <ion-segment-button layout="icon-bottom">
      <ion-icon name="heart"></ion-icon>
      <ion-label>Item Two</ion-label>
    </ion-segment-button>
    <ion-segment-button layout="icon-bottom">
      <ion-icon name="pin"></ion-icon>
      <ion-label>Item Three</ion-label>
    </ion-segment-button>
  </ion-segment>

  <!-- Icon start -->
  <ion-segment>
    <ion-segment-button checked layout="icon-start">
      <ion-label>Item One</ion-label>
      <ion-icon name="call"></ion-icon>
    </ion-segment-button>
    <ion-segment-button layout="icon-start">
      <ion-label>Item Two</ion-label>
      <ion-icon name="heart"></ion-icon>
    </ion-segment-button>
    <ion-segment-button layout="icon-start">
      <ion-label>Item Three</ion-label>
      <ion-icon name="pin"></ion-icon>
    </ion-segment-button>
  </ion-segment>

  <!-- Icon end -->
  <ion-segment>
    <ion-segment-button checked layout="icon-end">
      <ion-icon name="call"></ion-icon>
      <ion-label>Item One</ion-label>
    </ion-segment-button>
    <ion-segment-button disabled layout="icon-end">
      <ion-icon name="heart"></ion-icon>
      <ion-label>Item Two</ion-label>
    </ion-segment-button>
    <ion-segment-button layout="icon-end">
      <ion-icon name="pin"></ion-icon>
      <ion-label>Item Three</ion-label>
    </ion-segment-button>
  </ion-segment>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    segmentButtonClicked(ev: any) {
      console.log('Segment button clicked', ev);
    }
  }
</script>
```
