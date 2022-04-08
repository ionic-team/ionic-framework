```html
<!-- Basic -->
<ion-datetime-button datetime="basic-datetime"></ion-datetime-button>
<ion-datetime id="basic-datetime"></ion-datetime>

<!-- Modal -->
<ion-datetime-button id="modal-datetime-button" datetime="modal-datetime"></ion-datetime-button>

<ion-modal trigger="modal-datetime-button">
  <ng-template>
    <ion-content>
      <ion-datetime id="modal-datetime"></ion-datetime>
    </ion-content>
  </ng-template>
</ion-modal>

<!-- Popover -->
<ion-datetime-button id="popover-datetime-button" datetime="popover-datetime"></ion-datetime-button>

<ion-popover trigger="popover-datetime-button">
  <ng-template>
    <ion-content>
      <ion-datetime id="popover-datetime"></ion-datetime>
    </ion-content>
  </ng-template>
</ion-popover>

<!-- Accordion -->
<ion-accordion-group #accordionGroup>
  <ion-accordion value="datetime" #accordion>
    <ion-item slot="header">
      <ion-label>Select Date</ion-label>
      <ion-datetime-button id="accordion-datetime-button" slot="end" datetime="accordion-datetime" (click)="handleAccordion(#accordionGroup, #accordion, $event)"></ion-datetime-button>
    </ion-item>

    <ion-datetime slot="content" id="accordion-datetime"></ion-datetime>
  </ion-accordion>
</ion-accordion-group>
```

**component.ts**
```typescript
import { Component } from '@angular/core';

@Component({…})
export class MyComponent {
  constructor() {}
  
  handleAccordion(accordionGroup: HTMLElement, accordion: HTMLElement, ev: Event) {
    accordionGroup.value = accordion.value;
    
    /**
     * Prevent the click event
     * from bubbling up and causing
     * the accordion to close
     * if opened.
     */
    ev.stopPropagation();
  }
}
```