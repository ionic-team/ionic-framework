# Ionic Vue

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
