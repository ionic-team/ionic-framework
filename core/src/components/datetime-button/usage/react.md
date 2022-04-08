```tsx
import React, { useRef } from 'react';

import { IonAccordionGroup, IonAccordion, IonContent, IonDatetime, IonDatetimeButton, IonItem, IonLabel, IonModal, IonPopover, IonPage } from '@ionic/react';

export const DatetimeButtonExample: React.FC = () => {
  const accordionGroupRef = useRef(null);
  const accordionRef = useRef(null);
  
  const handleAccordion = (ev: Event) => {
    if (accordionGroupRef.current && accordionRef.current) {
      accordionGroupRef.current.value = accordionRef.current.value;
      
      /**
       * Prevent the click event
       * from bubbling up and causing
       * the accordion to close
       * if opened.
       */
      ev.stopPropagation();
    }
  }
  
  return (
    <IonPage>
      <IonContent>
        {/*-- Basic --*/}
        <IonDatetimeButton datetime="basic-datetime"></IonDatetimeButton>
        <IonDatetime id="basic-datetime"></IonDatetime>
      
        {/*-- Modal --*/}
        <IonDatetimeButton id="modal-datetime-button" datetime="modal-datetime"></IonDatetimeButton>
        
        <IonModal trigger="modal-datetime-button">
          <IonContent>
            <IonDatetime id="modal-datetime"></IonDatetime>
          </IonContent>
        </IonModal>
      
        {/*-- Popover --*/}
        <IonDatetimeButton id="popover-datetime-button" datetime="popover-datetime"></IonDatetimeButton>
        
        <IonPopover trigger="popover-datetime-button">
          <IonContent>
            <IonDatetime id="popover-datetime"></IonDatetime>
          </IonContent>
        </IonPopover>
      
        {/*-- Accordion --*/}
        <IonAccordionGroup ref={accordionGroupRef}>
          <IonAccordion value="datetime" ref={accordionRef}>
            <IonItem slot="header">
              <IonLabel>Select Date</IonLabel>
              <IonDatetimeButton
                id="accordIonDatetimeButton" 
                slot="end" 
                datetime="accordIonDatetime"
                onClick={handleAccordion}
              ></IonDatetimeButton>
            </IonItem>
        
            <IonDatetime slot="content" id="accordIonDatetime"></IonDatetime>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
    </IonPage>
  )
);
```