```html
<template>
  <!-- Initial value -->
  <ion-datetime value="2012-12-15T13:47:20.789"></ion-datetime>
  
  <!-- Readonly -->
  <ion-datetime readonly></ion-datetime>
  
  <!-- Disabled -->
  <ion-datetime disabled></ion-datetime>
  
  <!-- Custom locale -->
  <ion-datetime locale="en-GB"></ion-datetime>
  
  <!-- Max and min -->
  <ion-datetime min="1994-03-14" max="2012-12-09" value="2008-09-02"></ion-datetime>
  
  <!-- 15 minute increments -->
  <ion-datetime minute-values="0,15,30,45"></ion-datetime>
  
  <!-- Specific days/months/years --> 
  <ion-datetime month-values="6,7,8" year-values="2014,2015" day-values="01,02,03,04,05,06,08,09,10,11,12,13,14"></ion-datetime>
  
  <!-- Selecting time, no date -->
  <ion-datetime presentation="time"></ion-datetime>
  
  <!-- Selecting time first, date second -->
  <ion-datetime presentation="time-date"></ion-datetime>

  <!-- Full width size -->
  <ion-datetime size="cover"></ion-datetime>
  
  <!-- Custom Hour Cycle -->
  <ion-datetime hour-cycle="h23"></ion-datetime>
  
  <!-- Custom first day of week -->
  <ion-datetime first-day-of-week="1"></ion-datetime>

  <!-- Custom title -->
  <ion-datetime>
    <div slot="title">My Custom Title</div>
  </ion-datetime>

  <!-- Clear button -->
  <ion-datetime :show-clear-button="true"></ion-datetime>
  
  <!-- Custom buttons -->
  <ion-datetime ref="customDatetime">
    <ion-buttons slot="buttons">
      <ion-button @click="confirm()">Good to go!</ion-button>
      <ion-button @click="reset()">Reset</ion-button>
    </ion-buttons>
  </ion-datetime>
  
  <!-- Datetime in overlay -->
  <ion-button id="open-modal">Open Datetime Modal</ion-button>
  <ion-modal trigger="open-modal">
    <ion-content>
      <ion-datetime></ion-datetime>
    </ion-content>
  </ion-modal>

  <!-- Datetime in popover with input -->
  <ion-input type="date" id="date-input" :value="date1" />
  <ion-popver trigger="date-input-1" show-backdrop="false">
    <ion-datetime
      presentation="date"
      @ionChange="(ev: any) => date1 = convertDateValue(ev.detail.value)"
    />
  </ion-popover>

  <!-- Datetime in popover with input; button trigger -->
  <ion-item>
    <ion-input type="date" :value="date2" />
    <ion-button fill="clear" id="open-date-input-2">
      <ion-icon icon="calendar" />
    </ion-button>
    <ion-popover trigger="open-date-input-2" show-backdrop="false">
      <ion-datetime
        presentation="date"
        @ionChange="(ev: any) => date2 = convertDateValue(ev.detail.value)"
      />
    </ion-popover>
  </ion-item>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import {
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonInput,
    IonItem,
    IonModal,
    IonPopover
  } from '@ionic/vue';

  export default defineComponent({
    components: {
      IonButton,
      IonButtons,
      IonContent,
      IonDatetime,
      IonInput,
      IonItem,
      IonModal,
      IonPopover
    },
    setup() {
      const customDatetime = ref();
      const date1 = '';
      const date2 = '';

      const confirm = () => {
        if (customDatetime.value === undefined) return;
        
        customDatetime.value.$el.confirm();
      };

      const reset = () => {
        if (customDatetime.value === undefined) return;
        
        customDatetime.value.$el.reset();
      };

      const convertDateValue = (value: string) => {
        return value.split('T')[0];
      };

      return {
        customDatetime,
        confirm,
        reset
      }
    }
  })
</script>

<style>
  /* hide native calendar button */
  input[type="date"]::-webkit-inner-spin-button,
  input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }
</style>
```