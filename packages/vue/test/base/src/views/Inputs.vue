<template>
  <ion-page data-pageid="inputs">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Inputs</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="segment" :disabled="isDisabled">
          <ion-segment-button value="dogs">
            <ion-label>Dogs</ion-label>
          </ion-segment-button>
          <ion-segment-button value="cats">
            <ion-label>Cats</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="searchbar" :disabled="isDisabled"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Inputs</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item>
        <ion-checkbox v-model="checkbox" :disabled="isDisabled">Checkbox</ion-checkbox>
      </ion-item>

      <ion-item>
        <ion-toggle v-model="toggle" :disabled="isDisabled">Toggle</ion-toggle>
      </ion-item>

      <ion-item>
        <ion-input v-model="input" label="Input" required @ionBlur="handleValidation" @ionInput="handleValidation" :disabled="isDisabled" :readonly="isReadonly"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input-otp v-model="inputOtp" :disabled="isDisabled" :readonly="isReadonly"></ion-input-otp>
      </ion-item>

      <ion-item>
        <ion-range label="Range" :dual-knobs="true" :min="0" :max="100" slot="end" v-model="range" :disabled="isDisabled"></ion-range>
      </ion-item>

      <ion-item>
        <ion-textarea label="Textarea" v-model="textarea" required @ionBlur="handleValidation" @ionInput="handleValidation" :disabled="isDisabled" :readonly="isReadonly"></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-label>Datetime</ion-label>
        <ion-datetime v-model="datetime" :disabled="isDisabled" :readonly="isReadonly"></ion-datetime>
      </ion-item>

      <ion-radio-group v-model="radio">
        <ion-item>
          <ion-radio value="red" :disabled="isDisabled">Red</ion-radio>
        </ion-item>
        <ion-item>
          <ion-radio value="green" :disabled="isDisabled">Green</ion-radio>
        </ion-item>
        <ion-item>
          <ion-radio value="blue" :disabled="isDisabled">Blue</ion-radio>
        </ion-item>
      </ion-radio-group>

      <ion-item>
        <ion-select v-model="select" label="Select" :disabled="isDisabled">
          <ion-select-option value="apples">Apples</ion-select-option>
          <ion-select-option value="bananas">Bananas</ion-select-option>
        </ion-select>
      </ion-item>

      <div class="ion-padding">
        Checkbox: {{ checkbox }}<br>
        Toggle: {{ toggle }}<br>
        Input: <span id="input-ref">{{ input }}</span><br>
        Input OTP: <span id="input-otp-ref">{{ inputOtp }}</span><br>
        Range: {{ range }}<br>
        Textarea: <span id="textarea-ref">{{ textarea }}</span><br>
        Searchbar: <span id="searchbar-ref">{{ searchbar }}</span><br>
        Datetime: {{ datetime }}<br>
        Radio Group: {{ radio }}<br>
        Segment: {{ segment }}<br>
        Select: {{ select }}<br>

        <br>

        <ion-button expand="block" @click="reset" id="reset">Reset Values</ion-button>
        <ion-button expand="block" @click="set" id="set">Set Values</ion-button>
        <ion-button expand="block" @click="toggleDisable" id="disable">Toggle Disabled</ion-button>
        <ion-button expand="block" @click="toggleReadonly" id="readonly">Toggle Readonly</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonInputOtp,
  IonItem,
  IonLabel,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/vue';
import { ref } from 'vue';

const checkbox = ref(false);
const toggle = ref(false);
const input = ref('');
const inputOtp = ref('');
const range = ref({
  lower: 30,
  upper: 70
});
const textarea = ref('');
const searchbar = ref('');
const datetime = ref('');
const radio = ref('red');
const segment = ref('dogs');
const select = ref('apples');

// States
const isDisabled = ref(false);
const isReadonly = ref(false);

const reset = () => {
  checkbox.value = false;
  toggle.value = false;
  input.value = '';
  inputOtp.value = '';
  range.value = {
    lower: 30,
    upper: 70
  };
  textarea.value = '';
  searchbar.value = '';
  datetime.value = '';
  radio.value = 'red';
  segment.value = 'dogs';
  select.value = 'apples';
}

const set = () => {
  checkbox.value = true;
  toggle.value = true;
  input.value = 'Hello World';
  inputOtp.value = '1234';
  range.value = {
    lower: 10,
    upper: 90
  }
  textarea.value = 'Lorem Ipsum';
  searchbar.value = 'Search Query';
  datetime.value = '2019-01-31';
  radio.value = 'blue';
  segment.value = 'cats';
  select.value = 'bananas';
}

const toggleDisable = () => {
  isDisabled.value = !isDisabled.value;
};

const toggleReadonly = () => {
  isReadonly.value = !isReadonly.value;
};

const setIonicClasses = (element: HTMLElement, isBlurEvent: boolean) => {
  requestAnimationFrame(() => {
    let isValid = false;

    // Handle ion-textarea which uses shadow DOM
    if (element.tagName === 'ION-TEXTAREA') {
      const nativeTextarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null;
      if (nativeTextarea) {
        isValid = nativeTextarea.checkValidity();
      }
    // Handle ion-input which uses scoped encapsulation
    } else if (element.tagName === 'ION-INPUT') {
      const nativeInput = element.querySelector('input') as HTMLInputElement | null;
      if (nativeInput) {
        isValid = nativeInput.checkValidity();
      }
    }

    // Remove validation classes
    element.classList.remove('ion-valid', 'ion-invalid', 'ion-untouched');

    // Mark as touched only on blur
    if (isBlurEvent) {
      element.classList.add('ion-touched');
    }

    // Add validation classes based on validity state
    if (isValid) {
      element.classList.add('ion-valid');
    } else {
      element.classList.add('ion-invalid');
    }
  });
};

const handleValidation = (event: CustomEvent) => {
  const element = event.target as HTMLElement;
  if (!element) return;

  const isBlurEvent = event.type === 'ionBlur';
  setIonicClasses(element, isBlurEvent);
};
</script>
