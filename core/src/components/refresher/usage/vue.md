```html
<template>
  <!-- Default Refresher -->
  <ion-content>
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
  </ion-content>

  <!-- Custom Refresher Properties -->
  <ion-content>
    <ion-refresher slot="fixed" pull-factor="0.5" pull-min="100" pull-max="200">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
  </ion-content>

  <!-- Custom Refresher Content -->
  <ion-content>
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content
        pulling-icon="arrow-dropdown"
        pulling-text="Pull to refresh"
        refreshing-spinner="circles"
        refreshing-text="Refreshing...">
      </ion-refresher-content>
    </ion-refresher>
  </ion-content>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {

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

### Native Refreshers

Both iOS and Android modes provide refreshers that take advantage of properties exposed by their respective devices that give pull to refresh a fluid, native-like feel. One of the limitations of this is that the refreshers only work on their respective platform devices. For example, the iOS native `ion-refresher` works on an iPhone in iOS mode, but does not work on an Android device in iOS mode.

#### iOS Usage

```html
<ion-content>
  <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>

  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">All Inboxes</ion-title>
    </ion-toolbar>
    <ion-toolbar>
      <ion-searchbar></ion-searchbar>
    </ion-toolbar>
  </ion-header>

  <ion-list>
  ...
  </ion-list>
</ion-content>
```

Using the iOS native `ion-refresher` requires setting the `pulling-icon` property on `ion-refresher-content` to the value of one of the available spinners. See the [ion-spinner Documentation](https://ionicframework.com/docs/api/spinner#properties) for accepted values. `pulling-icon` defaults to the `lines` spinner on iOS. The spinner tick marks will be progressively shown as the user pulls down on the page.

#### Android Usage

Coming soon!