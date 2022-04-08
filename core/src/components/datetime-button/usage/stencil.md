```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'datetime-button-example',
  styleUrl: 'datetime-button-example.css'
})
export const DatetimeButtonExample {
  private accordionGroupRef?: HTMLIonAccordionGroupElement;
  private accordionRef?: HTMLIonAccordionElement;

  private handleAccordion = (ev: Event) => {
    const { accordionGroupRef, accordionRef } = this.
    
    if (accordionGroupRef && accordionRef) {
      accordionGroupRef.value = accordionRef.value;
      
      /**
       * Prevent the click event
       * from bubbling up and causing
       * the accordion to close
       * if opened.
       */
      ev.stopPropagation();
    }
  }
  
  render() {
    return (
      <ion-page>
        <ion-content>
          {/*-- Basic --*/}
          <ion-datetime-button datetime="basic-datetime"></ion-datetime-button>
          <ion-datetime id="basic-datetime"></ion-datetime>
        
          {/*-- Modal --*/}
          <ion-datetime-button id="modal-datetime-button" datetime="modal-datetime"></ion-datetime-button>
          
          <ion-modal trigger="modal-datetime-button">
            <ion-content>
              <ion-datetime id="modal-datetime"></ion-datetime>
            </ion-content>
          </ion-modal>
        
          {/*-- Popover --*/}
          <ion-datetime-button id="popover-datetime-button" datetime="popover-datetime"></ion-datetime-button>
          
          <ion-popover trigger="popover-datetime-button">
            <ion-content>
              <ion-datetime id="popover-datetime"></ion-datetime>
            </ion-content>
          </ion-popover>
        
          {/*-- Accordion --*/}
          <ion-accordion-group ref={el => this.accordionGroupRef}>
            <ion-accordion value="datetime" ref={el => accordionRef}>
              <ion-item slot="header">
                <ion-label>Select Date</ion-label>
                <ion-datetime-button
                  id="accordion-datetime-button" 
                  slot="end" 
                  datetime="accordion-datetime"
                  onClick={(ev: Event) => handleAccordion()}
                ></ion-datetime-button>
              </ion-item>
          
              <ion-datetime slot="content" id="accordion-datetime"></ion-datetime>
            </ion-accordion>
          </ion-accordion-group>
        </ion-content>
      </ion-page>
    );
  }
);
```