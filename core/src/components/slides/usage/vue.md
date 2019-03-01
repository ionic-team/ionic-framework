```html
<template>
  <ion-slides pager="true" :options="slideOpts">
    <ion-slide>
      <h1>Slide 1</h1>
    </ion-slide>
    <ion-slide>
      <h1>Slide 2</h1>
    </ion-slide>
    <ion-slide>
      <h1>Slide 3</h1>
    </ion-slide>
  </ion-slides>
</template>


<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class SelectExample extends Vue {
    slideOpts = {
      effect: 'flip'
    };
  }
</script>
```
