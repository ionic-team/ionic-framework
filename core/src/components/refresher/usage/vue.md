```html
<template>
  <!-- Default Refresher -->
  <ion-content>
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
  </ion-content>

  <!-- Custom Refresher Content -->
  <ion-content>
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content
        pullingIcon="arrow-dropdown"
        pullingText="Pull to refresh"
        refreshingSpinner="circles"
        refreshingText="Refreshing...">
      </ion-refresher-content>
    </ion-refresher>
  </ion-content>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Menu extends Vue {

    doRefresh(event) {
      console.log('Begin async operation');

      setTimeout(() => {
        console.log('Async operation has ended');
        event.target.complete();
      }, 2000);
    }
  }
</script>
```
