<template>
  <ion-page data-pageid="inputs">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Inputs</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="segment">
          <ion-segment-button value="dogs">
            <ion-label>Dogs</ion-label>
          </ion-segment-button>
          <ion-segment-button value="cats">
            <ion-label>Cats</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="searchbar"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Inputs</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-item>
        <ion-checkbox v-model="checkbox">Checkbox</ion-checkbox>
      </ion-item>

      <ion-item>
        <ion-toggle v-model="toggle">Toggle</ion-toggle>
      </ion-item>

      <ion-item>
        <ion-input v-model="input" label="Input"></ion-input>
      </ion-item>

      <ion-item>
        <ion-range label="Range" :dual-knobs="true" :min="0" :max="100" slot="end" v-model="range"></ion-range>
      </ion-item>

      <ion-item>
        <ion-textarea label="Textarea" v-model="textarea"></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-label>Datetime</ion-label>
        <ion-datetime v-model="datetime"></ion-datetime>
      </ion-item>

      <ion-radio-group v-model="radio">
        <ion-item>
          <ion-radio value="red">Red</ion-radio>
        </ion-item>
        <ion-item>
          <ion-radio value="green">Green</ion-radio>
        </ion-item>
        <ion-item>
          <ion-radio value="blue">Blue</ion-radio>
        </ion-item>
      </ion-radio-group>

      <ion-item>
        <ion-select v-model="select" label="Select">
          <ion-select-option value="apples">Apples</ion-select-option>
          <ion-select-option value="bananas">Bananas</ion-select-option>
        </ion-select>
      </ion-item>

      <div class="ion-padding">
        Checkbox: {{ checkbox }}<br>
        Toggle: {{ toggle }}<br>
        Input: <span id="input-ref">{{ input }}</span><br>
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
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
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
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonDatetime,
    IonHeader,
    IonInput,
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
  },
  setup() {
    const checkbox = ref(false);
    const toggle = ref(false);
    const input = ref('');
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

    const reset = () => {
      checkbox.value = false;
      toggle.value = false;
      input.value = '';
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

    return {
      checkbox,
      toggle,
      input,
      range,
      textarea,
      searchbar,
      datetime,
      radio,
      segment,
      select,

      reset,
      set
    }
  }
});
</script>
