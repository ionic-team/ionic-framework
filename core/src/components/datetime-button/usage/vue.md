```html
<template>
  <!-- Basic -->
  <ion-datetime-button datetime="basic-datetime"></ion-datetime-button>
  <ion-datetime id="basic-datetime"></ion-datetime>
  
  <!-- Modal -->
  <ion-datetime-button id="modal-datetime-button" datetime="modal-datetime"></ion-datetime-button>
  
  <ion-modal trigger="modal-datetime-button">
    <ion-content>
      <ion-datetime id="modal-datetime"></ion-datetime>
    </ion-content>
  </ion-modal>
  
  <!-- Popover -->
  <ion-datetime-button id="popover-datetime-button" datetime="popover-datetime"></ion-datetime-button>
  
  <ion-popover trigger="popover-datetime-button">
    <ion-content>
      <ion-datetime id="popover-datetime"></ion-datetime>
    </ion-content>
  </ion-popover>
  
  <!-- Accordion -->
  <ion-accordion-group ref="accordionGroup">
    <ion-accordion value="datetime" ref="accordion">
      <ion-item slot="header">
        <ion-label>Select Date</ion-label>
        <ion-datetime-button id="accordion-datetime-button" slot="end" datetime="accordion-datetime" @click="handleAccordion($event)"></ion-datetime-button>
      </ion-item>
  
      <ion-datetime slot="content" id="accordion-datetime"></ion-datetime>
    </ion-accordion>
  </ion-accordion-group>
</template>

<script>
  import {
    IonAccordion, 
    IonAccordionGroup,
    IonDatetime,
    IonDatetimeButton,
    IonItem, 
    IonLabel,
    IonModal,
    IonPopover,
  } from '@ionic/vue';
  import { defineComponent, ref } from 'vue';

  export default defineComponent({
    components: { 
      IonAccordion, 
      IonAccordionGroup,
      IonDatetime,
      IonDatetimeButton,
      IonItem, 
      IonLabel,
      IonModal,
      IonPopover
    },
    setup() {
      const accordionGroup = ref();
      const accordion = ref();
      const handleAccordion = (ev: Event) => {
        if (accordionGroup.value && accordion.value) {
          accordionGroup.value.$el.value = accordion.value.$el.value;
          
          /**
           * Prevent the click event
           * from bubbling up and causing
           * the accordion to close
           * if opened.
           */
          ev.stopPropagation();
        }
      }
      return {
        accordionGroup,
        accordion,
        handleAccordion
      }
    }
  });
</script>
```