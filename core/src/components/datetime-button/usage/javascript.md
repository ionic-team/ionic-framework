```html
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
<ion-accordion-group>
  <ion-accordion value="datetime">
    <ion-item slot="header">
      <ion-label>Select Date</ion-label>
      <ion-datetime-button id="accordion-datetime-button" slot="end" datetime="accordion-datetime"></ion-datetime-button>
    </ion-item>

    <ion-datetime slot="content" id="accordion-datetime"></ion-datetime>
  </ion-accordion>
</ion-accordion-group>

<script>
  const datetimeButton = document.querySelector('accordion-datetime-button');
  const accordionGroup = document.querySelector('ion-accordion-group');
  const accordion = document.querySelector('ion-accordion');

  datetimeButton.onclick = () => {
    accordionGroup.value = accordion.value;
    
    /**
     * Prevent the click event
     * from bubbling up and causing
     * the accordion to close
     * if opened.
     */
    ev.stopPropagation();
  }
</script>
```