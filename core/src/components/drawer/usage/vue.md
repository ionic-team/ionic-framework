```html
<template>
  <ion-drawer presentDefault="true" :options="drawerOpts">
    <h1>Header</h1>
    <div>Content</div> 
  </ion-drawer>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component()
  export default class Example extends Vue {
    // Optional parameters to pass to the drawer instance. See https://github.com/roman-rr/cupertino-pane/ for valid options.
    drawerOpts = {
      showDraggable: true,
      breaks: {
        top: { enabled: false, offset: 0 },
        middle: { enabled: true, offset: 0 },
        bottom: { enabled: true, offset: 0 },
      }
    };
  }
</script>
```
