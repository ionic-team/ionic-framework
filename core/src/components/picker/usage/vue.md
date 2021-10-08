```vue
<template>
  <div>
    <ion-button @click="openPicker">SHOW PICKER</ion-button>
    <p v-if="picked.animal">picked: {{ picked.animal.text }}</p>
  </div>
</template>

<script>
import { IonButton, pickerController } from "@ionic/vue";
export default {
  components: {
    IonButton,
  },
  data() {
    return {
      pickingOptions: {
        name: "animal",
        options: [
          { text: "Dog", value: "dog" },
          { text: "Cat", value: "cat" },
          { text: "Bird", value: "bird" },
        ],
      },
      picked: {
        animal: "",
      },
    };
  },
  methods: {
    async openPicker() {
      const picker = await pickerController.create({
        columns: [this.pickingOptions],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
          },
          {
            text: "Confirm",
            handler: (value) => {
              this.picked = value;
              console.log(`Got Value ${value}`);
            },
          },
        ],
      });
      await picker.present();
    },
  },
};
</script>
```
