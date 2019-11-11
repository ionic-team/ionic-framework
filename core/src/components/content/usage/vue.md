```html
<template>
  <ion-content
    :scrollEvents="true"
    @ionScrollStart="logScrollStart()"
    @ionScroll="logScrolling($event)"
    @ionScrollEnd="logScrollEnd()">
  </ion-content>
</template>
```

