```tsx
import React, { useRef } from 'react';

import { IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList, IonPage } from '@ionic/react';
import { arrowDownCircle } from 'ionicons/icons';

export const AccordionExample: React.FC = () => {
  const accordionGroupRef = useRef(null);
  const logAccordionValue = () => {
    if (accordionGroupRef.current) {
      console.log(accordionGroupRef.current.value);
    }
  }
  const closeAccordion = () => {
    if (accordionGroupRef.current) {
      accordionGroupRef.current.value = undefined;
    }
  }
  
  return (
    <IonPage>
      <IonContent>
        {/*-- Basic --*/}
        <IonAccordionGroup>
          <IonAccordion value="colors">
            <IonItem slot="header">
              <IonLabel>Colors</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Red</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Green</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Blue</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="shapes">
            <IonItem slot="header">
              <IonLabel>Shapes</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Circle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Triangle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Square</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="numbers">
            <IonItem slot="header">
              <IonLabel>Numbers</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>1</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>2</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>3</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
      
        {/*-- Custom Icon --*/}
        <IonAccordionGroup>
          <IonAccordion value="colors" toggleIcon={arrowDownCircle}>
            <IonItem slot="header">
              <IonLabel>Colors</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Red</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Green</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Blue</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="shapes" toggleIcon={arrowDownCircle}>
            <IonItem slot="header">
              <IonLabel>Shapes</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Circle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Triangle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Square</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="numbers" toggleIcon={arrowDownCircle}>
            <IonItem slot="header">
              <IonLabel>Numbers</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>1</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>2</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>3</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
      
        {/*-- Open Accordion --*/}
        <IonAccordionGroup value="colors">
          <IonAccordion value="colors">
            <IonItem slot="header">
              <IonLabel>Colors</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Red</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Green</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Blue</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="shapes">
            <IonItem slot="header">
              <IonLabel>Shapes</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Circle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Triangle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Square</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="numbers">
            <IonItem slot="header">
              <IonLabel>Numbers</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>1</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>2</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>3</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
      
        {/*-- Multiple Accordions --*/}
        <IonAccordionGroup multiple={true} value={['colors', 'numbers']}>
          <IonAccordion value="colors">
            <IonItem slot="header">
              <IonLabel>Colors</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Red</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Green</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Blue</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="shapes">
            <IonItem slot="header">
              <IonLabel>Shapes</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Circle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Triangle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Square</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="numbers">
            <IonItem slot="header">
              <IonLabel>Numbers</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>1</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>2</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>3</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
        
        {/*-- Getting and setting the state of the accordion group --*/}
        <IonAccordionGroup value="numbers" ref={accordionGroupRef}>
          <IonAccordion value="colors">
            <IonItem slot="header">
              <IonLabel>Colors</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Red</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Green</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Blue</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="shapes">
            <IonItem slot="header">
              <IonLabel>Shapes</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>Circle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Triangle</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Square</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
          <IonAccordion value="numbers">
            <IonItem slot="header">
              <IonLabel>Numbers</IonLabel>
            </IonItem>
      
            <IonList slot="content">
              <IonItem>
                <IonLabel>1</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>2</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>3</IonLabel>
              </IonItem>
            </IonList>
          </IonAccordion>
        </IonAccordionGroup>
        
        <IonButton onClick={() => logAccordionValue()}>Log Value of Accordion Group</IonButton>
        <IonButton onClick={() => closeAccordion()}>Close All Accordions</IonButton>
      </IonContent>
    </IonPage>
  )
);
```
