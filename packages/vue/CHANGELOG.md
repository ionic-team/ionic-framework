# Ionic Vue

> This file contains the changelog for the Ionic Vue beta. For the latest changes, see our [main changelog file](https://github.com/ionic-team/ionic-framework/blob/master/CHANGELOG.md).

## 0.5.2

### Bug Fixes

* **vue:** add missing tabs attribute to router outlet inside ion-tabs ([#22226](https://github.com/ionic-team/ionic/issues/22226)) ([ba4f07e](https://github.com/ionic-team/ionic/commit/ba4f07e270830d3eca67d71051a57ba7c7105f85))

### Upgrade Steps

```
npm i @ionic/vue@0.5.2 @ionic/vue-router@0.5.2
```

### New to Ionic Vue?

Check out our [Quickstart Guide](https://ionicframework.com/docs/vue/quickstart) to get up and running. Then be sure to check out our [Building Your First App Guide](https://ionicframework.com/docs/vue/your-first-app) to learn how build a cross platform Ionic Vue application from start to finish!



## 0.5.1

### Bug Fixes

* **vue:** correctly handle platform specific icons ([#22200](https://github.com/ionic-team/ionic/issues/22200)) ([25d3ea6](https://github.com/ionic-team/ionic/commit/25d3ea6b8d78016e9122c4ec02016af33a2041e8)), closes [#19078](https://github.com/ionic-team/ionic/issues/19078)
* **vue:** correctly update property values ([#22218](https://github.com/ionic-team/ionic/issues/22218)) ([2527189](https://github.com/ionic-team/ionic/commit/25271897e2a5acd216f4076ab0284bb91023d424)), closes [#22079](https://github.com/ionic-team/ionic/issues/22079)
* **vue:** ion-nav now handles Vue components properly ([#22197](https://github.com/ionic-team/ionic/issues/22197)) ([2c6259c](https://github.com/ionic-team/ionic/commit/2c6259c1f6f715d46e32ae4ab6142f448dda631c)), closes [#22184](https://github.com/ionic-team/ionic/issues/22184)
* **vue:** pass props to component when using modal and popover controller ([#22198](https://github.com/ionic-team/ionic/issues/22198)) ([e84f804](https://github.com/ionic-team/ionic/commit/e84f80493cb9e2c17e6bc5f3e68582eaf643f2cf)), closes [#22189](https://github.com/ionic-team/ionic/issues/22189)

### Upgrade Steps

```
npm i @ionic/vue@0.5.1 @ionic/vue-router@0.5.1
```

### New to Ionic Vue?

Check out our [Quickstart Guide](https://ionicframework.com/docs/vue/quickstart) to get up and running. Then be sure to check out our [Building Your First App Guide](https://ionicframework.com/docs/vue/your-first-app) to learn how build a cross platform Ionic Vue application from start to finish!



## 0.5.0

### Bug Fixes

* **vue:** correctly render child pages in tabs ([#22141](https://github.com/ionic-team/ionic/issues/22141)) ([7e449a1](https://github.com/ionic-team/ionic/commit/7e449a1ca62956d36b92c32289e5db7a3acb6718))
* **vue:** overlays function properly when used via controller or template ([#22155](https://github.com/ionic-team/ionic/issues/22155)) ([fe5fadf](https://github.com/ionic-team/ionic/commit/fe5fadf19cd63087311959c549e7e7c55261b459)), closes [#22090](https://github.com/ionic-team/ionic/issues/22090)
* **vue:** pushing a non-tabs page inside of tabs no longer renders it inside of the tabs outlet ([#22112](https://github.com/ionic-team/ionic/issues/22112)) ([6ac6810](https://github.com/ionic-team/ionic/commit/6ac6810148182a829348e8cac2e3b722448dad98)), closes [#22066](https://github.com/ionic-team/ionic/issues/22066)

### Features

* **vue:** add keyboard hook ([#22145](https://github.com/ionic-team/ionic/issues/22145)) ([b76bfa3](https://github.com/ionic-team/ionic/commit/b76bfa36c207ab18450d874cb876803aace58bea))


### Performance Improvements

* **vue:** improved tree-shaking ([#22131](https://github.com/ionic-team/ionic/issues/22131)) ([f82bac1](https://github.com/ionic-team/ionic/commit/f82bac17806e87772033b4602285fe0662d190e3))

### Upgrade Steps

```
npm i @ionic/vue@0.5.0 @ionic/vue-router@0.5.0
```

With the release of `@ionic/vue@0.5.0`, developers can now use overlay components in their templates:

```typescript
<template>
  <ion-page>
    <ion-content>
      <ion-button @click="setModalOpen">Open Modal</ion-button>
      
      <ion-modal
        css-class="my-modal-class"
        :is-open="isModalOpen"
        @onDidDismiss="setModalClosed"
      >
        <h1>Modal Content</h1>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonButton, 
  IonContent, 
  IonModal, 
  IonPage
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonButton, 
    IonContent, 
    IonModal, 
    IonPage
  },
  setup() {
    const isModalOpen = ref(false);
    const setModalOpen = () => isModalOpen.value = true;
    const setModalClosed = () => isModalOpen.value = false;
    
    return {
      isModalOpen,
      setModalOpen,
      setModalClosed
    }
  }
})
</script>
```


## 0.4.0

### Bug Fixes

* **vue:** canGoBack now returns correct result with initial load redirect ([#22071](https://github.com/ionic-team/ionic/issues/22071)) ([8227844](https://github.com/ionic-team/ionic/commit/8227844cbc6da252acb97bfa0f9a2cefa40185f9))
* **vue:** ensure dynamic classes are synced with internal Ionic component classes ([#22096](https://github.com/ionic-team/ionic/issues/22096)) ([9cb22be](https://github.com/ionic-team/ionic/commit/9cb22be91a232c395780f7ceb50c3e9ae28e7dc2)), closes [#22051](https://github.com/ionic-team/ionic/issues/22051)
* **vue:** using refs with v-model now works properly ([#22092](https://github.com/ionic-team/ionic/issues/22092)) ([67fbb3b](https://github.com/ionic-team/ionic/commit/67fbb3b963e2e75284b578777057c0822720fb1e)), closes [#22076](https://github.com/ionic-team/ionic/issues/22076)


### Features

* **vue:** add hardware back button hook ([#22069](https://github.com/ionic-team/ionic/issues/22069)) ([a7f564b](https://github.com/ionic-team/ionic/commit/a7f564b818a6ce5f97d999934d5cca77da1b2c83))
* **vue:** add hook to access Ionic Vue router ([#22072](https://github.com/ionic-team/ionic/issues/22072)) ([3d34b68](https://github.com/ionic-team/ionic/commit/3d34b68fbd25b724b6f89c01642788d325f6e909))
* **vue:** add webHashHistory and memoryHistory options for router ([#22101](https://github.com/ionic-team/ionic/issues/22101)) ([fe2cf22](https://github.com/ionic-team/ionic/commit/fe2cf22f5dab4e13458be0a93d38d346a03f7e3d))


### Upgrade Steps

```
npm i @ionic/vue@0.4.0 @ionic/vue-router@0.4.0
```



## 0.3.1

* Vue 3 support

Enjoy! :tada:
