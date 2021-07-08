```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'accordion-example',
  styleUrl: 'accordion-example.css'
})
export const AccordionExample {
  private accordionGroupRef?: HTMLIonAccordionGroupEl;
  
  private logAccordionValue = () => {
    const { accordionGroupRef } = this;
    if (accordionGroupRef) {
      console.log(accordionGroupRef.value);
    }
  }
  
  private closeAccordion = () => {
    const { accordionGroupRef } = this;
    if (accordionGroupRef) {
      accordionGroupRef.value = undefined;
    }
  }
  
  render() {
    return [
      // Basic
      <ion-accordion-group>
        <ion-accordion value="colors">
          <ion-item slot="header">
            <ion-label>Colors</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>Red</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Green</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Blue</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="shapes">
          <ion-item slot="header">
            <ion-label>Shapes</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>Circle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Triangle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Square</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="numbers">
          <ion-item slot="header">
            <ion-label>Numbers</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>1</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>2</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>3</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>,

      // Custom Icon
      <ion-accordion-group>
        <ion-accordion value="colors" toggle-icon="arrow-down-circle">
          <ion-item slot="header">
            <ion-label>Colors</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>Red</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Green</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Blue</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="shapes" toggle-icon="arrow-down-circle">
          <ion-item slot="header">
            <ion-label>Shapes</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>Circle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Triangle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Square</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="numbers" toggle-icon="arrow-down-circle">
          <ion-item slot="header">
            <ion-label>Numbers</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>1</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>2</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>3</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>,

      // Open Accordion
      <ion-accordion-group value="colors">
        <ion-accordion value="colors">
          <ion-item slot="header">
            <ion-label>Colors</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>Red</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Green</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Blue</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="shapes">
          <ion-item slot="header">
            <ion-label>Shapes</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>Circle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Triangle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Square</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="numbers">
          <ion-item slot="header">
            <ion-label>Numbers</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>1</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>2</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>3</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>,

      // Multiple Accordions
      <ion-accordion-group multiple={true} value={['colors', 'numbers']}>
        <ion-accordion value="colors">
          <ion-item slot="header">
            <ion-label>Colors</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>Red</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Green</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Blue</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="shapes">
          <ion-item slot="header">
            <ion-label>Shapes</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>Circle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Triangle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Square</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="numbers">
          <ion-item slot="header">
            <ion-label>Numbers</ion-label>
          </ion-item>

          <ion-list slot="content">
            <ion-item>
              <ion-label>1</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>2</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>3</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>,
      
      {/* Getting and setting the state of the accordion group */}
      <ion-accordion-group value="numbers" ref={el => this.accordionGroupRef = el}>
        <ion-accordion value="colors">
          <ion-item slot="header">
            <ion-label>Colors</ion-label>
          </ion-item>
      
          <ion-list slot="content">
            <ion-item>
              <ion-label>Red</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Green</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Blue</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="shapes">
          <ion-item slot="header">
            <ion-label>Shapes</ion-label>
          </ion-item>
      
          <ion-list slot="content">
            <ion-item>
              <ion-label>Circle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Triangle</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>Square</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
        <ion-accordion value="numbers">
          <ion-item slot="header">
            <ion-label>Numbers</ion-label>
          </ion-item>
      
          <ion-list slot="content">
            <ion-item>
              <ion-label>1</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>2</ion-label>
            </ion-item>
            <ion-item>
              <ion-label>3</ion-label>
            </ion-item>
          </ion-list>
        </ion-accordion>
      </ion-accordion-group>,
      
      <ion-button onClick={() => logAccordionValue()}>Log Value of Accordion Group</ion-button>,
      <ion-button onClick={() => closeAccordion()}>Close All Accordions</ion-button>,
    ];
  }
);
```
