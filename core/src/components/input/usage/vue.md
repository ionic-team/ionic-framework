```html
<template>
  <!-- Default Input -->
  <IonInputVue></IonInputVue>

  <!-- Input with value -->
  <IonInputVue value="custom"></IonInputVue>

  <!-- Input with placeholder -->
  <IonInputVue placeholder="Enter Input"></IonInputVue>

  <!-- Input with clear button when there is a value -->
  <IonInputVue clearInput value="clear me"></IonInputVue>

  <!-- Number type input -->
  <IonInputVue type="number" value="333"></IonInputVue>

  <!-- Disabled input -->
  <IonInputVue value="Disabled" disabled></IonInputVue>

  <!-- Readonly input -->
  <IonInputVue value="Readonly" readonly></IonInputVue>

  <!-- Inputs with labels -->
  <ion-item>
    <ion-label>Default Label</ion-label>
    <IonInputVue></IonInputVue>
  </ion-item>

  <ion-item>
    <ion-label position="floating">Floating Label</ion-label>
    <IonInputVue></IonInputVue>
  </ion-item>

  <ion-item>
    <ion-label position="fixed">Fixed Label</ion-label>
    <IonInputVue></IonInputVue>
  </ion-item>

  <ion-item>
    <ion-label position="stacked">Stacked Label</ion-label>
    <IonInputVue></IonInputVue>
  </ion-item>

  <!-- v-model binding -->
  <IonInputVue v-model="foo"></IonInputVue>

  <!-- Event listeners -->
  <IonInputVue @ionChange="listener"></IonInputVue>

  <!-- Call Ionic methods -->
  <IonInputVue ref="myInput"></IonInputVue>
</template>

<script>
export default {
  data() {
    return {
      foo: 'default input value',
    }
  },
  methods: {
    listener(value) {
      console.log(value);
    },
    focus() {
      this.$refs.myInput.setFocus();
    }
  },
}
</script>
```