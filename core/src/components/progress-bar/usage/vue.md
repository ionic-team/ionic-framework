```html
<template>
  <!-- Default Progressbar -->
  <ion-progress-bar></ion-progress-bar>

  <!-- Default Progressbar with 50 percent -->
  <ion-progress-bar value="0.5"></ion-progress-bar>

  <!-- Colorize Progressbar -->
  <ion-progress-bar color="primary" value="0.5"></ion-progress-bar>
  <ion-progress-bar color="secondary" value="0.5"></ion-progress-bar>

  <!-- Other types -->
  <ion-progress-bar value="0.25" buffer="0.5"></ion-progress-bar>
  <ion-progress-bar type="indeterminate"></ion-progress-bar>
  <ion-progress-bar type="indeterminate" reversed="true"></ion-progress-bar>
</template>

<script>
import { IonProgressBar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonProgressBar }
});
</script>
```
